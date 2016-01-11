package edu.virginia.lib.modernlibrary;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.FacetField.Count;
import org.apache.solr.client.solrj.response.QueryResponse;
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
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Properties;

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
        File solrDocDir = new File("solr-output");
        
        m.generateSolrDocs(new File("resources/transmog-xml"), solrDocDir);

        m.writeSolrDocs(solrDocDir, solrUrl);

        m.summarizeFacets(solrUrl);
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

    public void summarizeFacets(String solrUpdateUrl) throws SolrServerException {
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
                System.out.println("  " + c.getName() + " [" + c.getCount() + "]");
            }
        }
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
        final String collectionName = "Modern Library Bibliography 1925-1937";
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
}
