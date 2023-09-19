<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <html>
            <body>
                <xsl:apply-templates select="//teiHeader"/>
                <xsl:apply-templates select="//body"/>
            </body>
        </html>
    </xsl:template>

    <!-- Templates for the <teiHeader> section -->
    <xsl:template match="teiHeader">
        <header>
            <xsl:apply-templates select="fileDesc/titleStmt"/>
            <xsl:apply-templates select="fileDesc/publicationStmt"/>
            <xsl:apply-templates select="fileDesc/sourceDesc"/>
        </header>
    </xsl:template>

    <xsl:template match="titleStmt">
        <div class="title-statement">
            <h1><xsl:value-of select="title[@type='main']"/></h1>
            <h2><xsl:value-of select="title[@type='sort']"/></h2>
            <div class="author">
                <xsl:value-of select="author/name[@type='corporate']"/>
                <span>, </span>
                <xsl:value-of select="author/name[@type='sub-unit']"/>
            </div>
            <div class="date">
                <xsl:value-of select="biblScope/date"/>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="publicationStmt">
        <div class="publication-statement">
            <div class="publisher">
                <xsl:value-of select="publisher"/>
            </div>
            <div class="pub-place">
                <xsl:value-of select="pubPlace"/>
            </div>
            <div class="date">
                <xsl:value-of select="date"/>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="sourceDesc">
        <div class="source-description">
            <h1 class="title">
                <xsl:value-of select="biblFull/titleStmt/title[@type='main']"/>
            </h1>
            <div class="edition">
                <xsl:value-of select="biblFull/editionStmt/edition"/>
            </div>
            <div class="extent">
                <xsl:value-of select="biblFull/extent"/>
            </div>
            <div class="notes">
                <xsl:for-each select="biblFull/notesStmt/note">
                    <p><xsl:value-of select="."/></p>
                </xsl:for-each>
            </div>
        </div>
    </xsl:template>

    <!-- Templates for the body content -->
    <xsl:template match="body">
        <xsl:apply-templates select=".//div1"/>
    </xsl:template>

    <xsl:template match="div1">
        <div>
            <h2>
                <xsl:apply-templates select=".//head"/>
            </h2>
            <xsl:apply-templates select=".//table"/>
            <xsl:apply-templates select=".//p"/>
        </div>
    </xsl:template>

    <xsl:template match="head">
        <xsl:value-of select="."/>
    </xsl:template>

    <xsl:template match="table">
        <table>
            <xsl:for-each select=".//row">
                <tr>
                    <xsl:apply-templates select=".//cell"/>
                </tr>
            </xsl:for-each>
        </table>
    </xsl:template>

    <xsl:template match="cell">
        <td>
            <xsl:value-of select="."/>
        </td>
    </xsl:template>

    <xsl:template match="p">
        <p>
            <xsl:value-of select="."/>
        </p>
    </xsl:template>

    <xsl:template match="closer">
        <div class="closer">
            <div class="dateline">
                <xsl:value-of select="dateline/date"/>
            </div>
            <xsl:for-each select="signed">
                <div class="signed">
                    <xsl:value-of select="."/>
                </div>
            </xsl:for-each>
        </div>
    </xsl:template>

</xsl:stylesheet>
