<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <html>
            <body>
                <xsl:apply-templates select="//body"/>
            </body>
        </html>
    </xsl:template>

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

</xsl:stylesheet>
