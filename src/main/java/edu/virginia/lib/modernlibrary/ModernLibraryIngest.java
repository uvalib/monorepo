package edu.virginia.lib.modernlibrary;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.FacetField.Count;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.params.ModifiableSolrParams;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlValue;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.stream.FactoryConfigurationError;
import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamWriter;
import javax.xml.transform.Templates;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.regex.Pattern;

/**
 * This class' main method generates and publishes solr documents for the 
 * Modern Library Bibliographies that exist.
 * 
 * In order to work in virgo, solr must be reconfigured to expose any of 
 * the optional facets configured in the XLST.  Furthermore, blacklight's
 * catalog_controler.rb must also define the facet field, providing a 
 * human-readable name.
 *
 */
public class ModernLibraryIngest {

    public static void main(String [] args) throws Exception {
        String solrUrl = null;
        File config = new File("config.properties");
        if (config.exists()) {
            Properties p = new Properties();
            FileInputStream fis = new FileInputStream(config);
            try {
                p.load(fis);
            } finally {
                fis.close();
            }
            solrUrl = p.getProperty("solrUrl");
        }
        
        ModernLibraryIngest m = new ModernLibraryIngest();
        
        transformCorrectionSpreadsheet(new File("src/main/resources/name-mapping.xlsx"), new File("src/main/resources/name-mapping.xml"));
        transformCorrectionSpreadsheet(new File("src/main/resources/printer-mapping.xlsx"), new File("src/main/resources/printer-mapping.xml"));
        transformReplacementSpreadsheet(new File("src/main/resources/series-metadata.xlsx"), new File("src/main/resources/series-values.xml"));
        
        File solrDocDir = new File("solr-output");
        
        m.generateSolrDocs(new File("resources/transmog-xml"), solrDocDir);

        m.writeSolrDocs(solrDocDir, solrUrl);

        m.summarizeAndValidateFacets(solrUrl);

    }

    private DocumentBuilder b;
    private Transformer transmog2Solr;

    public ModernLibraryIngest() throws ParserConfigurationException, IOException, SAXException, TransformerConfigurationException {
        DocumentBuilderFactory f = DocumentBuilderFactory.newInstance();
        f.setNamespaceAware(true);
        b = f.newDocumentBuilder();

        TransformerFactory tFactory = TransformerFactory.newInstance();
        Templates templates = tFactory.newTemplates(
                new DOMSource(b.parse(this.getClass().getClassLoader().getResourceAsStream("transmog-to-solr.xsl"))));
        transmog2Solr = templates.newTransformer();

    }

    /**
     * Takes a two column spreadsheet and converts it into a mapping file.
     * <mapping>
     *   <name>
     *     <find>Ii, Oscar Hammerstein</find>
     *     <replacement>Hammerstein, Oscar, II</replacement>
     *   </name>
     * </mapping>
     * @throws FactoryConfigurationError 
     * @throws XMLStreamException 
     */
    private static void transformCorrectionSpreadsheet(File xlsx, File xml) throws InvalidFormatException, IOException, XMLStreamException, FactoryConfigurationError {
        XMLStreamWriter w = XMLOutputFactory.newInstance().createXMLStreamWriter(new FileOutputStream(xml), "UTF-8");
        try {
            final OPCPackage pkg = OPCPackage.open(xlsx.getPath());
            try {
                final Workbook wb = new XSSFWorkbook(pkg);
                final Sheet sheet = wb.getSheetAt(0);
                w.writeStartDocument();
                w.writeStartElement("mapping");
                for (Row r : sheet) {
                    try {
                        final String find = r.getCell(0).getStringCellValue();
                        final String replace = r.getCell(1).getStringCellValue();
                        w.writeStartElement("name");
                        w.writeStartElement("find");
                        w.writeCharacters(find);
                        w.writeEndElement();
                        w.writeStartElement("replacement");
                        w.writeCharacters(replace);
                        w.writeEndElement();
                        w.writeEndElement();
                    } catch (NullPointerException ex) {
                        System.err.println("Skipping row " + r.getRowNum());
                    }
                }
                w.writeEndElement();
                w.writeEndDocument();
            } finally {
                pkg.close();
            }
        } finally {
            w.close();
        }
    }
    
    public void createReplacementSpreadsheet(String solrUpdateUrl, OutputStream reportOut, final String fieldname) throws SolrServerException {
        PrintWriter p = new PrintWriter(new OutputStreamWriter(reportOut));
        char delim = ',';
        p.println("id" + delim + "year" + delim + "title" + delim + fieldname);
        SolrServer s = new HttpSolrServer(solrUpdateUrl.substring(0, solrUpdateUrl.indexOf("/update")));
        Iterator<SolrDocument> recordIt = ModernLibraryIngest.getRecordsForQuery(s, "*:*");
        while (recordIt.hasNext()) {
            SolrDocument doc = recordIt.next();
            if (!"series".equals(doc.getFirstValue("hierarchy_level_display"))) {
                p.print("\"" + getFieldValues(doc, "id") + "\"" + delim);
                p.print("\"" + getFieldValues(doc, "catalog_facet") + "\"" + delim);
                p.print("\"" + getFieldValues(doc, "title_display") + "\"");
                Collection<Object> fields = doc.getFieldValues(fieldname);
                if (fields != null) {
                    for (Object value : fields) {
                        p.print(delim + "\"" + String.valueOf(value) + "\"");
                    }
                }
                p.println();
            }
        }
        p.flush();
    }
    
    /**
     * Transforms a spreasheet that specifies replacement values for certain fields into 
     * XML that can be used by the XSLT that generates the solr documents.
     * <replacement>
     *   <entry>
     *     <id>ML_116</find>
     *     <field>series_facet</field>
     *     <value>Series 1</value>
     *     <value>Series 2</value>
     *   <entry>
     * </replacement>
     */
    private static void transformReplacementSpreadsheet(File xlsx, File xml) throws InvalidFormatException, IOException, XMLStreamException, FactoryConfigurationError {
        XMLStreamWriter w = XMLOutputFactory.newInstance().createXMLStreamWriter(new FileOutputStream(xml), "UTF-8");
        try {
            final OPCPackage pkg = OPCPackage.open(xlsx.getPath());
            try {
                final Workbook wb = new XSSFWorkbook(pkg);
                final Sheet sheet = wb.getSheetAt(0);
                w.writeStartDocument();
                w.writeStartElement("replacement");
                int idCol = 0;
                String field = null;
                for (Row r : sheet) {
                    if (r.getRowNum() == 0) {
                        field = r.getCell(3).getStringCellValue();
                    } else {
                        w.writeStartElement("entry");
                        w.writeStartElement("id");
                        w.writeCharacters(r.getCell(idCol).getStringCellValue());
                        w.writeEndElement();
                        w.writeStartElement("field");
                        w.writeCharacters(field);
                        w.writeEndElement();
                        for (Cell c : r) {
                            if (c.getColumnIndex() >= 3) {
                                w.writeStartElement("value");
                                w.writeCharacters(c.getStringCellValue());
                                w.writeEndElement();
                            }
                        }
                        w.writeEndElement();
                    }
                }
                w.writeEndElement();
                w.writeEndDocument();
            } finally {
                pkg.close();
            }
        } finally {
            w.close();
        }
    }
    
    public void createMetadataSpreadsheet(String solrUpdateUrl, OutputStream reportOut) throws SolrServerException {
        PrintWriter p = new PrintWriter(new OutputStreamWriter(reportOut));
        char delim = ',';
        p.println("Title" + delim + "Author" + delim + "Illustrator" + delim + "Translator" + delim + "Introducer" + delim + "Designer" + delim + "Printer" + delim + "Publishers Note" + delim + "ML number" + delim + "ML series" + delim + "ML publication date" + delim + "ML catalog reference" + delim + "ML price" + delim + "ML discontinued date" + delim + "Torchbearer");
        SolrServer s = new HttpSolrServer(solrUpdateUrl.substring(0, solrUpdateUrl.indexOf("/update")));
        Iterator<SolrDocument> recordIt = ModernLibraryIngest.getRecordsForQuery(s, "*:*");
        while (recordIt.hasNext()) {
            SolrDocument doc = recordIt.next();
            if (!"series".equals(doc.getFirstValue("hierarchy_level_display")) && !"collection".equals(doc.getFirstValue("hierarchy_level_display"))) {
                p.print("\"" + getFieldValues(doc, "title_display") + "\",");
                p.print("\"" + getFieldValues(doc, "author_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "illustrator_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "translator_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "introduction_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "designer_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "printer_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "pub_note_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "ml_number_facet") + "\",");
                p.print(","); // no Series information yet in index
                p.print("\"" + getFieldValues(doc, "first_published_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "catalog_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "price_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "discontinued_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "torchbearer_facet") + "\",");
                p.print("\"" + getFieldValues(doc, "ml_series_facet") + "\"");
                p.println();
            }
        }
        p.flush();
    }
    
    private static String getFieldValues(SolrDocument doc, String fieldName) {
        Collection<Object> values = doc.getFieldValues(fieldName);
        if (values == null || values.isEmpty()) {
            return "";
        } else {
            StringBuffer response = new StringBuffer();
            for (Object v : values) {
                if (response.length() > 0) {
                    response.append(", ");
                }
                response.append(String.valueOf(v));
            }
            return response.toString();
        }
    }
    
    private String nullToBlank(String value) {
        if (value == null) {
            return "";
        } else {
            return value;
        }
    }
    
    public void summarizeAndValidateFacets(String solrUpdateUrl) throws SolrServerException {
        List<String> errors = new ArrayList<String>();
        SolrServer s = new HttpSolrServer(solrUpdateUrl.substring(0, solrUpdateUrl.indexOf("/update")));
        final List<String> result = new ArrayList<String>();
        final ModifiableSolrParams p = new ModifiableSolrParams();
        p.set("q", new String[] { "*:*"});
        p.set("rows", 0);
        p.set("start", 0);
        p.set("facet", "true");
        p.set("facet.field", "has_optional_facet");
        p.set("facet.mincount", 1);
        QueryResponse response = s.query(p);
        ArrayList<String> facets = new ArrayList<String>();
        for (Count c : response.getFacetField("has_optional_facet").getValues()) {
            facets.add(c.getName()); 
        }
        p.set("facet.field", facets.toArray(new String[0]));
        response = s.query(p);
        for (FacetField f : response.getFacetFields()) {
            System.out.println(f.getName());
            for (Count c : f.getValues()) {
                if (f.getName().equals("ml_number_facet") && !isInteger(c.getName())) {
                    errors.add("\"" + c.getName() + "\" is not a valid ML number!");
                }
                System.out.println("  " + c.getName() + " [" + c.getCount() + "]");
            }
        }
        for (String error : errors) {
            System.err.println(error);
        }
    }
    
    public boolean isInteger(final String value) {
        return Pattern.compile("\\d+").matcher(value).matches();
    }
    
    public void writeSolrDocs(File docDir, String solrUpdateUrl) throws IOException {
        for (File f : docDir.listFiles()) {
			System.out.println("POSTing " + f + " to \"" + solrUpdateUrl + "\".");
            SolrUtil.postSolrDoc(f, solrUpdateUrl);
        }
        SolrUtil.commit(solrUpdateUrl);
        System.out.println("Committed records at \"" + solrUpdateUrl + "\".");

    }

    public void generateSolrDocs(File transmogFiles, File outputDir) throws IOException, SAXException, TransformerException, JAXBException {
        final String dateReceived = new SimpleDateFormat("yyyyMMdd").format(new Date());
        final String collectionName = "Modern Library Bibliography 1925-1959";
        final String collectionNameShort = "Modern Library Bibliography";

        outputDir.mkdirs();
        transmog2Solr.setParameter("outputDirFileUri", outputDir.toURI().toString());
        transmog2Solr.setParameter("dateReceived", dateReceived);
        for (File f : transmogFiles.listFiles()) {
            FileInputStream fis = new FileInputStream(f);
            try {
                Document d = b.parse(f);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                transmog2Solr.transform(new DOMSource(d), new StreamResult(baos));
            } finally {
                System.out.println("Closing " + f.getName() + "...");
                fis.close();
            }
        }

        // compile collection document
        List<SolrRecord> series = new ArrayList<SolrRecord>();
        for (File f : outputDir.listFiles()) {
            SolrRecord s = parseSolrDoc(f);
            if ("series".equals(s.getFirstFieldValue("hierarchy_level_display"))) {
                final String id = s.getFirstFieldValue("id");
                series.add(s);
            }
        }
        Collections.sort(series, new Comparator<SolrRecord>() {
            //@Override
            public int compare(SolrRecord o1, SolrRecord o2) {
                return o1.getFirstFieldValue("year_multisort_i").compareTo(o2.getFirstFieldValue("year_multisort_i"));
            }

            @Override
            public boolean equals(Object obj) {
                return false;
            }
        });

        ArrayList<Field> fields = new ArrayList<Field>();
        fields.add(new Field("id", "ML"));
        fields.add(new Field("title_display", collectionName));
        fields.add(new Field("digital_collection_facet", collectionName));
        fields.add(new Field("title_text", collectionName));
        fields.add(new Field("shadowed_location_facet", "VISIBLE"));
        fields.add(new Field("hierarchy_level_display", "collection"));
        fields.add(new Field("feature_facet", "has_hierarchy"));
        fields.add(new Field("feature_facet", "suppress_ris_export"));
        fields.add(new Field("feature_facet", "suppress_refworks_export"));
        fields.add(new Field("feature_facet", "suppress_endnote_export"));
        fields.add(new Field("feature_facet", "is_bibliographic_entry"));
        fields.add(new Field("date_received_facet", dateReceived));
        fields.add(new Field("has_optional_facet", "ml_number_facet"));
        fields.add(new Field("has_optional_facet", "torchbearer_facet"));
        fields.add(new Field("has_optional_facet", "price_facet"));
        fields.add(new Field("has_optional_facet", "pub_note_facet"));
        fields.add(new Field("has_optional_facet", "designer_facet"));
        fields.add(new Field("has_optional_facet", "printer_facet"));        
        fields.add(new Field("has_optional_facet", "introduction_facet"));
        fields.add(new Field("has_optional_facet", "translator_facet"));
        fields.add(new Field("has_optional_facet", "illustrator_facet"));
        fields.add(new Field("has_optional_facet", "first_published_facet"));
        fields.add(new Field("has_optional_facet", "discontinued_facet"));
        fields.add(new Field("has_optional_facet", "catalog_facet"));
        fields.add(new Field("has_optional_facet", "ml_series_facet"));
        fields.add(new Field("embedded_tei_display", "<TEI.2><text><body><p>This is some contextual information to describe the bibliography as a whole.  Please feel free to provide text be presented here.</p></body></text><TEI.2>"));
        fields.add(new Field("date_display", "1925-1959"));
        fields.add(new Field("format_facet", "Online"));
        fields.add(new Field("format_facet", "Bibliography"));
        
        fields.add(new Field("breadcrumbs_display", "<breadcrumbs></breadcrumbs>"));

        final StringBuffer hierarchy = new StringBuffer();
        hierarchy.append("<collection>\n" +
                "   <title>" + collectionName + "</title>\n" +
                "   <shorttitle>" + collectionNameShort + "</shorttitle>\n" +
                "   <component_count>" + series.size() + "</component_count>\n" +
                "   <digitized_component_count>" + series.size() + "</digitized_component_count>");
        for (SolrRecord s : series) {
            hierarchy.append(s.getFirstFieldValue("hierarchy_display"));
        }
        hierarchy.append("</collection>");
        fields.add(new Field("hierarchy_display", hierarchy.toString()));

        SolrRecord collectionRec = new SolrRecord();
        collectionRec.field = fields.toArray(new Field[0]);
        writeOut(collectionRec, new File(outputDir, "ML.xml"));
    }

    @XmlRootElement (name="add")
    private static class SolrRecord {
        @XmlElementWrapper(name="doc")
        @XmlElement
        private Field[] field;

        public String getFirstFieldValue(String fieldName) {
            for (Field f : field) {
                if (f.name.equals(fieldName)) {
                    return f.value;
                }
            }
            return null;
        }
    }

    private static class Field {
        @XmlAttribute
        private String name;

        @XmlValue
        private String value;

        public Field() {

        }

        public Field(String name, String value) {
            this.name = name;
            this.value = value;
        }

    }

    public static SolrRecord parseSolrDoc(File f) throws JAXBException, IOException {
        FileInputStream fis = new FileInputStream(f);
        try {
            JAXBContext jc = JAXBContext.newInstance(SolrRecord.class);
            Unmarshaller unmarshaller = jc.createUnmarshaller();
            JAXBElement<SolrRecord> p = unmarshaller.unmarshal(new StreamSource(fis), SolrRecord.class);
            final SolrRecord s = p.getValue();
            return s;
        } finally {
            fis.close();
        }
    }

    public static void writeOut(SolrRecord r, File f) throws JAXBException, IOException {
        JAXBContext jc = JAXBContext.newInstance(SolrRecord.class);
        Marshaller m = jc.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        m.marshal(r, f);
    }
    
    public static Iterator<SolrDocument> getRecordsForQuery(final SolrServer solr, String query) throws SolrServerException {
        int start = 0;
        final ModifiableSolrParams p = new ModifiableSolrParams();
        p.set("q", new String[] { query });
        p.set("rows", 100);
        p.set("start", start);
        return new Iterator<SolrDocument>() {

            int index = 0;
            int start = 0;
            QueryResponse response = null;

            public boolean hasNext() {
                if (response == null || response.getResults().size() <= index) {
                    p.set("rows", 100);
                    p.set("start", start);
                    try {
                        response = solr.query(p);
                        start += response.getResults().size();
                        index = 0;
                    } catch (SolrServerException e) {
                        throw new RuntimeException(e);
                    }
                }
                return response.getResults().size() > index;
            }

            public SolrDocument next() {
                if (!hasNext()) {
                    throw new IllegalStateException();
                }
                return response.getResults().get(index ++);
            }
            
            public void remove() {
                throw new UnsupportedOperationException();
            }

        };
    }
}
