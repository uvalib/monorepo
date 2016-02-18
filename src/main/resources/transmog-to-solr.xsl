<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema" version="2.0">
  <xsl:output indent="yes" />
  
  <xsl:param name="outputDirFileUri" />
  <xsl:param name="dateReceived" required="yes" />
  <xsl:param name="collection">Modern Library Bibliography 1925-1959</xsl:param>
  <xsl:param name="collectionID">ML</xsl:param>
  <xsl:param name="itemVisibility">UNDISCOVERABLE</xsl:param>
  <xsl:param name="mlbAuthor">Neavill, Gordon Barrick</xsl:param>
  <xsl:variable name="nameMapping" select="document('src/main/resources/name-mapping.xml')" />
  <xsl:variable name="printerMapping" select="document('src/main/resources/printer-mapping.xml')" />
  <xsl:variable name="series" select="document('src/main/resources/series-values.xml')" />
  
  <xsl:template match="/">
    <xsl:variable name="year">
      <xsl:call-template name="getVolumeYear" />
    </xsl:variable>
    <xsl:variable name="catalogReference">
      <xsl:for-each select="//TEI/HEAD[1]/span">
        <xsl:value-of select="normalize-space(text())" />
      </xsl:for-each>
    </xsl:variable>
    <xsl:variable name="price">
      <xsl:for-each select="//TEI/PRICE/PARAGRAPH/span">
        <xsl:value-of select="normalize-space(text())" />
      </xsl:for-each>
    </xsl:variable>
    <xsl:message terminate="no">Writing Series level document <xsl:value-of select="concat($outputDirFileUri, $year, '.xml')"/></xsl:message>
    <xsl:result-document href="{$outputDirFileUri}ML_{$year}.xml">
      <xsl:variable name="id">ML_<xsl:value-of select="normalize-space($year)" /></xsl:variable>
      <add>
        <doc>
          <field name="id"><xsl:value-of select="$id"/></field>
          
          <xsl:apply-templates select="/TEI/*" mode="solr" />
          
          <xsl:call-template name="applyDefaultFields" />
          
          <field name="year_multisort_i"><xsl:value-of select="$year" /></field>
          
          <field name="feature_facet">has_hierarchy</field>
          <field name="hierarchy_level_display">series</field>
          
          <field name="author_facet"><xsl:value-of select="$mlbAuthor"></xsl:value-of></field>
          <field name="author_text"><xsl:value-of select="$mlbAuthor"></xsl:value-of></field>
          <field name="creator_text"><xsl:value-of select="$mlbAuthor"></xsl:value-of></field>
          <field name="creator_display"><xsl:value-of select="$mlbAuthor"></xsl:value-of></field>
          
          <field name="breadcrumbs_display">
            <xsl:call-template name="getVolumeBreadcrumbsDisplay" />
          </field>
          <field name="hierarchy_display"><xsl:call-template name="getVolumeHierarchyDisplay" /></field>

          <field name="feature_facet">has_tei</field>
          <field name="embedded_tei_display">
            <xsl:text>&lt;TEI.2&gt;&lt;text&gt;&lt;body&gt;</xsl:text>
            <xsl:call-template name="toTei">
              <xsl:with-param name="selection" select="/TEI/*[not(name()='BOOK')]" />
            </xsl:call-template>
            <xsl:text>&lt;/body&gt;&lt;/text&gt;&lt;/TEI.2&gt;</xsl:text>
          </field>
          
          <xsl:variable name="fulltext">
            <xsl:call-template name="toText">
              <xsl:with-param name="selection" select="current()" />
            </xsl:call-template>
          </xsl:variable>
          <field name="fulltext_text" boost="0.2">
            <xsl:value-of select="$fulltext" />
          </field>
          
        </doc>
      </add>
    </xsl:result-document>
    <xsl:for-each select="/TEI/BOOK">
      <xsl:variable name="item">
        <xsl:for-each select="NUMBER[1]/span"><xsl:value-of select="normalize-space(text())"></xsl:value-of></xsl:for-each>
      </xsl:variable>
      <xsl:variable name="title"><xsl:apply-templates select="METADATA/TITLE/*" mode="text" /></xsl:variable>
      <xsl:message terminate="no">Writing document <xsl:value-of select="concat($outputDirFileUri, $item, '.xml')"/></xsl:message>
      <xsl:variable name="id">ML_<xsl:value-of select="normalize-space($item)" /></xsl:variable>
      <xsl:result-document href="{$outputDirFileUri}ML_{$item}.xml">
        <add>
          <doc>
            <field name="id"><xsl:value-of select="$id"/></field>
            <xsl:if test="normalize-space($price) != ''">
              <field name="price_facet"><xsl:value-of select="$price" /></field>
            </xsl:if>
            <field name="catalog_facet"><xsl:value-of select="$catalogReference" /></field> 
            
            <xsl:apply-templates select="current()/*" mode="item-solr"></xsl:apply-templates>
            
            <xsl:call-template name="applyDefaultFields" />

            <xsl:if test="$series//replacement/entry[id/text() = $id]">
              <xsl:for-each select="$series//replacement/entry[id/text() = $id]/value">
                <field name="ml_series_facet"><xsl:value-of select="current()"/></field>
              </xsl:for-each>
            </xsl:if>

            <field name="year_multisort_i"><xsl:value-of select="$year" /></field>
            <field name="feature_facet">has_hierarchy</field>
            <field name="hierarchy_level_display">item</field>
            <field name="breadcrumbs_display">
              <xsl:call-template name="getItemBreadcrumbsDisplay" />
            </field>
            <field name="hierarchy_display">
              <xsl:call-template name="getItemHierarchyDisplay">
                <xsl:with-param name="year" select="$item" />
                <xsl:with-param name="title" select="$title" />
              </xsl:call-template>
            </field>
            
            <field name="feature_facet">has_tei</field>
            <field name="embedded_tei_display">
              <xsl:text>&lt;TEI.2&gt;&lt;text&gt;&lt;body&gt;</xsl:text>
              <xsl:call-template name="toTei">
                <xsl:with-param name="selection" select="current()" />
              </xsl:call-template>
              <xsl:text>&lt;/body&gt;&lt;/text&gt;&lt;/TEI.2&gt;</xsl:text>
            </field>
            
            <xsl:variable name="fulltext">
              <xsl:call-template name="toText">
                <xsl:with-param name="selection" select="current()" />
              </xsl:call-template>
            </xsl:variable>
            <xsl:call-template name="parseTorchbearers">
              <xsl:with-param name="fulltext" select="$fulltext" />
            </xsl:call-template>
            <xsl:call-template name="parsePublishersNotes">
              <xsl:with-param name="fulltext" select="$fulltext" />
            </xsl:call-template>
            <xsl:call-template name="parseDesigner">
              <xsl:with-param name="fulltext" select="$fulltext" />
            </xsl:call-template>
            <xsl:call-template name="parsePrinter">
              <xsl:with-param name="fulltext" select="$fulltext" />
            </xsl:call-template>
            <xsl:call-template name="parseIntroduction">
              <xsl:with-param name="fulltext" select="$fulltext" />
            </xsl:call-template>
            <xsl:call-template name="parseTranslator">
              <xsl:with-param name="fulltext" select="$fulltext" />
            </xsl:call-template>
            <xsl:call-template name="parseIllustrator">
              <xsl:with-param name="fulltext" select="$fulltext" />
            </xsl:call-template>
            <field name="fulltext_text" boost="0.2">
              <xsl:value-of select="$fulltext" />
            </field>
            
          </doc>
        </add>
      </xsl:result-document>
    </xsl:for-each>
  </xsl:template>
  
  <xsl:template name="applyDefaultFields">
    <field name="digital_collection_facet"><xsl:value-of select="$collection" /></field>
    <field name="shadowed_location_facet"><xsl:value-of select="$itemVisibility"/></field>
    <field name="date_received_facet"><xsl:value-of select="$dateReceived" /></field>
    <field name="feature_facet">suppress_ris_export</field>
    <field name="feature_facet">suppress_refworks_export</field>
    <field name="feature_facet">suppress_endnote_export</field>
    <field name="feature_facet">is_bibliographic_entry</field>
    <field name="language_display">English</field>
    <field name="language_facet">English</field>
    <field name="format_facet">Bibliographic Entry</field>
    <field name="has_optional_facet">torchbearer_facet</field>
    <field name="has_optional_facet">ml_number_facet</field>
    <field name="has_optional_facet">price_facet</field>
    <field name="has_optional_facet">pub_note_facet</field>
    <field name="has_optional_facet">designer_facet</field>
    <field name="has_optional_facet">printer_facet</field>
    <field name="has_optional_facet">translator_facet</field>
    <field name="has_optional_facet">introduction_facet</field>
    <field name="has_optional_facet">illustrator_facet</field>
    <field name="has_optional_facet">first_published_facet</field>
    <field name="has_optional_facet">discontinued_facet</field>
    <field name="has_optional_facet">catalog_facet</field>
    <field name="has_optional_facet">ml_series_facet</field>
    <field name="has_optional_facet">year_in_print_facet</field>
  </xsl:template>
  
  <xsl:template name="getVolumeTitle">
    <xsl:variable name="volumeTitle">
      <xsl:for-each select="//TEI/TITLE[1]/span">
        <xsl:value-of select="normalize-space(text())" />
      </xsl:for-each>
    </xsl:variable>
    <xsl:value-of select="normalize-space($volumeTitle)" />
  </xsl:template>
  
  <xsl:template name="getVolumeYear">
    <xsl:variable name="volumeHeader">
      <xsl:for-each select="//TEI/HEAD[1]/span">
        <xsl:value-of select="normalize-space(text())" />
      </xsl:for-each>
    </xsl:variable>
    <xsl:analyze-string select="normalize-space($volumeHeader)" regex="([0-9]+)">
       <xsl:matching-substring>
         <xsl:value-of select="current()" />
       </xsl:matching-substring>
       <xsl:non-matching-substring>
         <xsl:message>Head doesn't match "<xsl:value-of select="current()"/>"</xsl:message>
       </xsl:non-matching-substring>
    </xsl:analyze-string>
  </xsl:template>
  
  <xsl:template name="getVolumeBreadcrumbsDisplay">
      <xsl:text>&lt;breadcrumbs&gt;&lt;ancestor&gt;&lt;id&gt;</xsl:text>
      <xsl:value-of select="$collectionID" />
      <xsl:text>&lt;/id&gt;&lt;title&gt;</xsl:text>
      <xsl:value-of select="$collection" />
      <xsl:text>&lt;/title&gt;&lt;/ancestor&gt;&lt;/breadcrumbs&gt;</xsl:text>
  </xsl:template>
  
  <xsl:template name="getVolumeHierarchyDisplay">
    <xsl:variable name="year">
      <xsl:call-template name="getVolumeYear" />
    </xsl:variable>
    <xsl:variable name="title">
      <xsl:call-template name="getVolumeTitle" />
    </xsl:variable>
    <xsl:text>&lt;component&gt;</xsl:text>
    <xsl:call-template name="getVolumeBreadcrumbsDisplay" />
    <xsl:text>&lt;id&gt;ML_</xsl:text>
    <xsl:value-of select="$year"></xsl:value-of>    
    <xsl:text>&lt;/id&gt;&lt;type&gt;series&lt;/type&gt;&lt;unittitle&gt;&lt;![CDATA[</xsl:text>
    <xsl:value-of select="$title" />
    <xsl:text>]]&gt;&lt;/unittitle&gt;&lt;shortunittitle&gt;&lt;![CDATA[</xsl:text>
    <xsl:value-of select="$year" />
    <xsl:text>]]&gt;&lt;/shortunittitle&gt;&lt;component_count&gt;</xsl:text>
    <xsl:value-of select="count(/TEI/BOOK)" />
    <xsl:text>&lt;/component_count&gt;&lt;digitized_component_count&gt;</xsl:text>
    <xsl:value-of select="count(/TEI/BOOK)" />
    <xsl:text>&lt;/digitized_component_count&gt;</xsl:text>
    <xsl:for-each select="/TEI/BOOK">
      <xsl:variable name="bookID"><xsl:apply-templates select="NUMBER[1]/*" mode="text" /></xsl:variable>
      <xsl:variable name="bookTitle"><xsl:apply-templates select="METADATA/TITLE[1]/*" mode="text" /></xsl:variable>
      <xsl:text>&lt;component&gt;&lt;id&gt;ML_</xsl:text>
      <xsl:value-of select="normalize-space($bookID)"></xsl:value-of>
      <xsl:text>&lt;/id&gt;&lt;type&gt;item&lt;/type&gt;&lt;unittitle&gt;&lt;![CDATA[</xsl:text>
      <xsl:value-of select="normalize-space($bookTitle)" />
      <xsl:text>]]&gt;&lt;/unittitle&gt;&lt;shortunittitle&gt;&lt;![CDATA[</xsl:text>
      <xsl:value-of select="normalize-space($bookTitle)" />
      <xsl:text>]]&gt;&lt;/shortunittitle&gt;&lt;/component&gt;</xsl:text>
    </xsl:for-each>  
    <xsl:text>&lt;/component&gt;</xsl:text>
  </xsl:template>
  
  <xsl:template name="getItemBreadcrumbsDisplay">
    <xsl:text>&lt;breadcrumbs&gt;&lt;ancestor&gt;&lt;id&gt;</xsl:text>
    <xsl:value-of select="$collectionID" />
    <xsl:text>&lt;/id&gt;&lt;title&gt;</xsl:text>
    <xsl:value-of select="$collection" />
    <xsl:text>>&lt;/title&gt;&lt;/ancestor&gt;&lt;ancestor&gt;&lt;id&gt;ML_</xsl:text>
    <xsl:call-template name="getVolumeYear" />
    <xsl:text>&lt;/id&gt;&lt;title&gt;</xsl:text>
    <xsl:call-template name="getVolumeTitle" />
    <xsl:text>&lt;/title&gt;&lt;/ancestor&gt;&lt;/breadcrumbs&gt;</xsl:text>
  </xsl:template>
  
  <xsl:template name="getItemHierarchyDisplay">
    <xsl:param name="year" required="yes" />
    <xsl:param name="title" required="yes" />
    <xsl:text>&lt;component&gt;</xsl:text>
    <xsl:call-template name="getItemBreadcrumbsDisplay" />
    <xsl:text>&lt;id&gt;ML_</xsl:text>
    <xsl:value-of select="$year"></xsl:value-of>
    <xsl:text>&lt;/id&gt;&lt;type&gt;item&lt;/type&gt;&lt;unittitle&gt;&lt;![CDATA[</xsl:text>
    <xsl:value-of select="$title" />
    <xsl:text>]]&gt;&lt;/unittitle&gt;&lt;shortunittitle&gt;&lt;![CDATA[</xsl:text>
    <xsl:value-of select="$title" />
    <xsl:text>]]&gt;&lt;/shortunittitle&gt;</xsl:text>
    <xsl:text>&lt;/component&gt;</xsl:text>
  </xsl:template>
  
  <xsl:template match="*" mode="#all" priority="-1" />

  <!-- MAIN SOLR DOC -->
  
  <xsl:template match="TITLE" mode="solr">
    <xsl:variable name="title"><xsl:apply-templates select="*" mode="text" /></xsl:variable>
    <field name="main_title_display"><xsl:value-of select="$title" /></field>
    <field name="title_display"><xsl:value-of select="$title" /></field>
    <field name="title_text"><xsl:value-of select="$title" /></field>
    <field name="full_title_text"><xsl:value-of select="$title" /></field>
  </xsl:template>
  
  
  
  <!-- ITEM SOLR DOC -->

  <xsl:template match="PARAGRAPH" mode="item-solr">
    <xsl:apply-templates select="*" mode="item-solr" />
  </xsl:template>
  
  <xsl:template match="METADATA[TITLE][ML_NUMBER][DATE_RANGE]" mode="item-solr">
    <xsl:variable name="full_title">
      <xsl:apply-templates select="*/span" mode="text" />
    </xsl:variable>
    <field name="title_display"><xsl:value-of select="$full_title" /></field>
    <field name="title_text"><xsl:value-of select="$full_title" /></field>
    <xsl:apply-templates select="*" mode="item-solr" />
  </xsl:template>
  
  
  <xsl:template match="NUMBER" mode="item-solr">
    <field name="number_text"><xsl:apply-templates select="*" mode="text" /></field>
  </xsl:template>
  
  <xsl:template match="AUTHOR" mode="item-solr">
    <xsl:variable name="rawauthor"><xsl:apply-templates select="*" mode="text" /></xsl:variable>
    <xsl:variable name="author"><xsl:call-template name="formatName"><xsl:with-param name="name" select="$rawauthor" /></xsl:call-template></xsl:variable>
    <field name="author_facet"><xsl:value-of select="$author"></xsl:value-of></field>
    <field name="author_text"><xsl:value-of select="$author"></xsl:value-of></field>
    <field name="creator_text"><xsl:value-of select="$author"></xsl:value-of></field>
    <field name="creator_display"><xsl:value-of select="$author"></xsl:value-of></field>
  </xsl:template>
  
  <xsl:template match="EDITOR" mode="item-solr">
    <xsl:variable name="rawauthor"><xsl:apply-templates select="*" mode="text" /></xsl:variable>
    <xsl:variable name="author"><xsl:call-template name="formatName"><xsl:with-param name="name" select="$rawauthor" /></xsl:call-template></xsl:variable>
    <field name="author_facet"><xsl:value-of select="$author"></xsl:value-of></field>
    <field name="author_text"><xsl:value-of select="$author"></xsl:value-of></field>
    <field name="creator_text"><xsl:value-of select="$author"></xsl:value-of></field>
    <field name="creator_display"><xsl:value-of select="$author"></xsl:value-of></field>
  </xsl:template>
  
  <xsl:template match="TITLE" mode="item-solr">
    <xsl:variable name="title"><xsl:apply-templates select="*" mode="text" /></xsl:variable>
    <field name="short_title_display"><xsl:value-of select="$title" /></field>
  </xsl:template>
  
  <xsl:template match="ML_NUMBER" mode="item-solr">
    <xsl:variable name="value"><xsl:apply-templates select="*" mode="text" /></xsl:variable>
    <xsl:for-each select="tokenize($value,';')">
      <field name="modern_library_number_facet"><xsl:value-of select="normalize-space(.)" /></field>
      <field name="ml_number_facet"><xsl:value-of select="normalize-space(.)" /></field>
      <field name="ml_number_display"><xsl:value-of select="normalize-space(.)" /></field>
      <field name="ml_number_text"><xsl:value-of select="normalize-space(.)" /></field>
    </xsl:for-each>
    
  </xsl:template>
  
  <xsl:template match="DATE_RANGE" mode="item-solr">
    <xsl:variable name="value"><xsl:apply-templates select="*" mode="text" /></xsl:variable>
    <field name="publication_date_range_display"><xsl:value-of select="$value" /></field>
    <!-- Sample patterns:
      "1999-2000"
      "1937–1971; 1982–  "
      -->
    <xsl:analyze-string select="$value" regex="^(\d\d\d\d).*$">
      <xsl:matching-substring>
        <field name="first_published_facet"><xsl:value-of select="regex-group(1)" /></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
    
    <xsl:analyze-string select="$value" regex="[–-](\d\d\d\d)">
      <xsl:matching-substring>
        <field name="discontinued_facet"><xsl:value-of select="regex-group(1)" /></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
    
    <xsl:analyze-string select="$value" regex="(\d\d\d\d)[–-](\d\d\d\d)">
      <xsl:matching-substring>
        <xsl:variable name="start" select="xs:integer(number(regex-group(1)))" as="xs:integer"/>
        <xsl:variable name="end" select="xs:integer(number(regex-group(2)))" as="xs:integer" />
        <xsl:for-each select="$start to $end">
          <field name="year_in_print_facet"><xsl:value-of select="current()" /></field>  
        </xsl:for-each>
      </xsl:matching-substring>
    </xsl:analyze-string>
    <xsl:analyze-string select="$value" regex="^.*(\d\d\d\d)[–-]\s*$">
      <xsl:matching-substring>
        <xsl:variable name="start" select="xs:integer(number(regex-group(1)))" as="xs:integer"/>
        <xsl:for-each select="$start to 2016">
          <field name="year_in_print_facet"><xsl:value-of select="current()" /></field>  
        </xsl:for-each>
      </xsl:matching-substring>
    </xsl:analyze-string>
    
    
  </xsl:template>


<!-- TEI processing -->
  
  <xsl:template name="toTei">
    <xsl:param name="selection" required="yes" />
    <xsl:for-each select="$selection">
      <xsl:apply-templates select="." mode="tei" /> 
    </xsl:for-each>
  </xsl:template>
  
  <xsl:template match="METADATA/TITLE" mode="tei">
    <xsl:apply-templates select="*" mode="tei" />
  </xsl:template>
  
  <xsl:template match="TITLE" mode="tei">
    <xsl:text>&lt;head&gt;</xsl:text>
    <xsl:apply-templates select="*" mode="tei" />
    <xsl:text>&lt;/head&gt;</xsl:text>
  </xsl:template>

  <xsl:template match="UNASSIGNED" mode="tei">
    <xsl:text>&lt;p&gt;</xsl:text>
    <xsl:apply-templates select="*" mode="tei" />
    <xsl:text>&lt;/p&gt;</xsl:text>
  </xsl:template>

  <xsl:template match="PARAGRAPH" mode="tei">
    <xsl:text>&lt;p&gt;</xsl:text>
      <xsl:apply-templates select="*" mode="tei" />
    <xsl:text>&lt;/p&gt;</xsl:text>
  </xsl:template>
  
  <xsl:template match="METADATA" mode="tei">
    <xsl:text>&lt;head&gt;</xsl:text>
    <xsl:apply-templates select="*" mode="tei" />
    <xsl:text>&lt;/head&gt;</xsl:text>
  </xsl:template>
  
  <xsl:template match="HEAD" mode="tei">
    <xsl:text>&lt;p&gt;</xsl:text>
    <xsl:apply-templates select="*" mode="tei" />
    <xsl:text>&lt;/p&gt;</xsl:text>
  </xsl:template>
  
  
  <xsl:template match="*" mode="tei">
    <xsl:apply-templates select="*" mode="tei"/>
  </xsl:template>

  <xsl:template match="span[@style='']" mode="tei">
    <xsl:text>&lt;![CDATA[</xsl:text>
    <xsl:value-of select="text()" />
    <xsl:text>]]&gt;</xsl:text>
  </xsl:template>
  
  <xsl:template match="span[not(@style='')]" mode="tei">
    <xsl:for-each select="tokenize(@style,' ')">
      <xsl:text>&lt;hi rend="</xsl:text>
      <xsl:value-of select="normalize-space(.)"></xsl:value-of>
      <xsl:text>"&gt;</xsl:text>
    </xsl:for-each>
    <xsl:text>&lt;![CDATA[</xsl:text>
    <xsl:value-of select="text()" />
    <xsl:text>]]&gt;</xsl:text>
    <xsl:for-each select="tokenize(@style,' ')">
      <xsl:text>&lt;/hi&gt;</xsl:text>
    </xsl:for-each>
  </xsl:template>
  
  <!-- Text processing -->
  
  <xsl:template name="toText">
    <xsl:param name="selection" required="yes" />
    <xsl:for-each select="$selection">
      <xsl:apply-templates select="." mode="text" /> 
    </xsl:for-each>
  </xsl:template>
  
  <xsl:template match="*" mode="text">
    <xsl:apply-templates select="*" mode="text" />
  </xsl:template>
  
  <!-- all text is expected to be in a span anyway -->
  <xsl:template match="span" mode="text">
    <xsl:value-of select="text()" />
  </xsl:template>
  
  <!-- Torchbearer processing -->
  <xsl:template name="parseTorchbearers">
    <xsl:param name="fulltext" required="yes" />
    <xsl:analyze-string select="$fulltext" regex="\[torchbearer ([A-Z]*[0-9]*)\]">
      <xsl:matching-substring>
        <field name="torchbearer_facet"><xsl:value-of select="regex-group(1)" /></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
    <!--<xsl:apply-templates select="*" mode="torchbearer" />-->
  </xsl:template>
  
  <!-- Publishers note processing -->
  <xsl:template name="parsePublishersNotes">
    <xsl:param name="fulltext" required="yes" />
    <xsl:analyze-string select="$fulltext" regex="pub\. note ([A-Z]*[0-9]*);">
      <xsl:matching-substring>
        <field name="pub_note_facet"><xsl:value-of select="regex-group(1)" /></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
  </xsl:template>
  
  <!-- Designer Processing -->
  <xsl:template name="parseDesigner">
    <xsl:param name="fulltext" required="yes" />
    <xsl:analyze-string select="$fulltext" regex="Designed by (([A-Z][a-z]* )+[A-Z][a-z]+)[\.,;]">
      <xsl:matching-substring>
        <field name="designer_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(1)" /></xsl:call-template></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
    <xsl:analyze-string select="$fulltext" regex="Designed by ([A-Z]\. [A-Z]\. [A-Z][a-z]+)\.">
      <xsl:matching-substring>
        <field name="designer_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(1)" /></xsl:call-template></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
  </xsl:template>
  
  <!-- Printer processing -->
  <xsl:template name="parsePrinter">
    <xsl:param name="fulltext" required="yes" />
    <xsl:analyze-string select="$fulltext" regex="printed from ([A-Z].*?) plates">
      <xsl:matching-substring>
         <field name="printer_facet"><xsl:call-template name="rewritePrinter"><xsl:with-param name="name" select="regex-group(1)" /></xsl:call-template></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
  </xsl:template>
  
  <!-- Introduction processing -->
  <xsl:template name="parseIntroduction">
    <xsl:param name="fulltext" required="yes" />
    <xsl:analyze-string select="$fulltext" regex="INTRODUCTION (\| )?BY (\| )?([ A-Za-z&#192;-&#214;&#216;-&#246;&#248;-&#447;]*?) \|">
      <xsl:matching-substring>
        <field name="introduction_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(3)" /></xsl:call-template></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
    <xsl:analyze-string select="$fulltext" regex="\| Introduction by (\| )?([ A-Za-z&#192;-&#214;&#216;-&#246;&#248;-&#447;]+?) \|">
      <xsl:matching-substring>
        <field name="introduction_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(2)" /></xsl:call-template></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
  </xsl:template>
  
  <!-- Translator processing -->
  <xsl:template name="parseTranslator">
    <xsl:param name="fulltext" required="yes" />
    <xsl:analyze-string select="$fulltext" regex="(TRANSLATED (FROM .*? )?BY (\| )?(.*?) \|)">
      <xsl:matching-substring>
        <!--<field name="translator_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(1)" /></xsl:call-template></field>-->
        <xsl:variable name="firstPass" select="regex-group(4)" />
        <xsl:analyze-string select="$firstPass" regex="^(.*?)[;\)].*$">
          <xsl:matching-substring>
            <field name="translator_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(1)"/></xsl:call-template></field>
          </xsl:matching-substring>
          <xsl:non-matching-substring>
            <xsl:analyze-string select="$firstPass" regex="^(.*) [aA][nN][Dd] (.*)$">
              <xsl:matching-substring>
                <field name="translator_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(1)"/></xsl:call-template></field>
                <field name="translator_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(2)"/></xsl:call-template></field>
              </xsl:matching-substring>
              <xsl:non-matching-substring>
                <field name="translator_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="$firstPass"/></xsl:call-template></field>    
              </xsl:non-matching-substring>
            </xsl:analyze-string>
          </xsl:non-matching-substring>
        </xsl:analyze-string>
      </xsl:matching-substring>
    </xsl:analyze-string>
  </xsl:template>


  <!-- Illustrator processing -->
  <xsl:template name="parseIllustrator">
    <xsl:param name="fulltext" required="yes" />
    <xsl:analyze-string select="$fulltext" regex="ILLUSTRATED BY (\| )?(.*?) \|">
      <xsl:matching-substring>
        <field name="illustrator_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(2)" /></xsl:call-template></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
    <xsl:analyze-string select="$fulltext" regex="Decorations by (.*?)\.">
      <xsl:matching-substring>
        <field name="illustrator_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(1)" /></xsl:call-template></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
    <xsl:analyze-string select="$fulltext" regex="illustrated by ([A-Z][a-z]+( [A-Z][a-z]+)+)">
      <xsl:matching-substring>
        <field name="illustrator_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(1)" /></xsl:call-template></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
    <xsl:analyze-string select="$fulltext" regex="illustration by ([A-Z][a-z]+( [A-Z][a-z]+)+)">
      <xsl:matching-substring>
        <field name="illustrator_facet"><xsl:call-template name="formatName"><xsl:with-param name="name" select="regex-group(1)" /></xsl:call-template></field>
      </xsl:matching-substring>
    </xsl:analyze-string>
  </xsl:template>

  <xsl:template name="formatName">
    <xsl:param name="name" />
      <xsl:variable name="formatted">
        <xsl:variable name="parts" select="tokenize(translate(normalize-space($name), '&#x20;&#x9;&#xD;&#xA0;', '    '), ' ')" />
      <xsl:call-template name="capitalize"><xsl:with-param name="string" select="$parts[last()]" /></xsl:call-template>
      <xsl:if test="count($parts) &gt; 1"><xsl:text>,</xsl:text></xsl:if>
      <xsl:for-each select="$parts">
        <xsl:if test="position() != last()">
          <xsl:text> </xsl:text>
          <xsl:call-template name="capitalize"><xsl:with-param name="string" select="." /></xsl:call-template>
        </xsl:if>
      </xsl:for-each>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$nameMapping//name[find/text() = $formatted]">
        <xsl:value-of select="$nameMapping//name[find/text() = $formatted]/replacement/text()" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$formatted" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template name="capitalize">
    <xsl:param name="string" />
    <xsl:value-of select="concat(upper-case(substring($string,1,1)), lower-case(substring($string, 2)))" />
  </xsl:template>

  <xsl:template name="rewritePrinter">
    <xsl:param name="name" />
    <xsl:choose>
      <xsl:when test="$printerMapping//name[find/text() = $name]">
        <xsl:value-of select="$printerMapping//name[find/text() = $name]/replacement/text()" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$name" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>