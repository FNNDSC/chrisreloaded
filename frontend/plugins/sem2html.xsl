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
        <strong><xsl:value-of select="title"/></strong><br/>
        <!-- process the parameters blocks -->
        <div class='panelgroup'>
          <xsl:apply-templates select="parameters"/>
        </div>
      </div>

  </xsl:template>

  <!-- Match the 'parameters' element and create the parameter groups -->
  <xsl:template match="parameters">
    <!-- The panel title -->
    <h3 class='panel_title'>
      <xsl:value-of select="label"/>
    </h3>
    <div>
    <span></span>
    <!-- All the different input parameters -->
    <xsl:apply-templates select="image"/>
    <xsl:apply-templates select="file"/>
    <xsl:apply-templates select="directory"/>
    <xsl:apply-templates select="integer"/>
    <xsl:apply-templates select="double"/>
    </div>
  </xsl:template>
  
  <!-- IMAGE/FILE parameter -->
  <xsl:template match="image | file | directory">
    <div>
      <xsl:attribute name="class">parameter_row</xsl:attribute>
      <span class='parameter_title_cropped'>
        <xsl:value-of select="label"/>
      </span>
      <span class='parameter_input parameter_dropzone' data-default='Drag and drop here'>
        <xsl:attribute name="data-flag"><xsl:value-of select="longflag"/></xsl:attribute>
         Drag and drop here</span>
    </div>
  </xsl:template>
  
  <!-- INTEGER/DOUBLE parameter -->
  <xsl:template match="integer | double">
    <div>
      <xsl:attribute name="class">parameter_row</xsl:attribute>
      <span class='parameter_title'>
        <xsl:value-of select="label"/>
      </span>
      <span class='parameter_input'>
        <xsl:attribute name="data-flag"><xsl:value-of select="longflag"/></xsl:attribute>
        <input class='parameter_spinner'>
          <xsl:attribute name="data-default"><xsl:value-of select="default"/></xsl:attribute>
          <xsl:attribute name="data-step"><xsl:value-of select="constraints/step"/></xsl:attribute>
        </input>
      </span>
    </div>
  </xsl:template>
    
</xsl:stylesheet>
