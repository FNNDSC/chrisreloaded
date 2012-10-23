<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- start matching at 'executable' element -->
  <xsl:template match="executable">
    <xsl:variable name="moduleTitle"><xsl:value-of select="title"/></xsl:variable>

      <div>
        <!-- attach the id -->
        <xsl:attribute name="id">panel_${PLUGIN_NAME}</xsl:attribute>
        <xsl:attribute name="class">plugin_panel</xsl:attribute>
        <!-- and hide it by default -->
        <xsl:attribute name="style">display:none;</xsl:attribute>
        <strong><xsl:value-of select="title"/></strong>
        <!-- process the parameters blocks -->
        <xsl:apply-templates select="parameters"/>
      </div>

  </xsl:template>

  <!-- Match the 'parameters' element and create the parameter groups -->
  <xsl:template match="parameters">
    <!-- The panel title -->
    <span>
      <xsl:value-of select="label"/>
    </span><br/>
    
    <!-- All the different input parameters -->
    <xsl:apply-templates select="image"/>
    
  </xsl:template>
  
  <!-- IMAGE parameter -->
  <xsl:template match="image">
    <div>
      <xsl:attribute name="class">parameter_row</xsl:attribute>
      <span>
        <strong><xsl:value-of select="name"/></strong>
      </span>
      <span class='parameter_input parameter_dropzone' data-default='Drag and drop here'> Drag and drop here</span>
    </div>
  </xsl:template>
 
</xsl:stylesheet>
