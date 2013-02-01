<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- start matching at 'executable' element -->
  <xsl:template match="executable">
      <div class='plugin_panel' style='display:none'>
        <!-- attach the id -->
        <xsl:attribute name="id">panel_${PLUGIN_NAME}</xsl:attribute>
        <xsl:attribute name="data-category"><xsl:value-of select="category"/></xsl:attribute>
        <xsl:attribute name="data-status"><xsl:value-of select="@status"/></xsl:attribute>
        <xsl:attribute name="data-memory"><xsl:value-of select="@memory"/></xsl:attribute>
        <xsl:attribute name="data-executable">${PLUGIN_EXECUTABLE}</xsl:attribute>
        <span>
          <strong><xsl:value-of select="title"/></strong>
          <span style="float:right;line-height:20px;">
            <xsl:attribute name="id">batch_${PLUGIN_NAME}</xsl:attribute>
          </span>
        </span><br/>
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
    <div class='panel_content'>
    <xsl:attribute name="data-advanced"><xsl:value-of select="@advanced"/></xsl:attribute>
    <xsl:attribute name="hidden-panel"><xsl:value-of select="@hidden"/></xsl:attribute>
    <span></span>
    <!-- All the different input parameters -->
    <xsl:apply-templates/>
    </div>
  </xsl:template>
  
  <!-- CREATE THE PARAMETER TITLE BASED ON LABEL OR LONGFLAG -->
  <xsl:template match="text()" />
  <xsl:template name="create_label">
    <span class='parameter_title'>
      <xsl:variable name="label" select="label"/>
      <xsl:variable name="name" select="name"/>
      <xsl:choose>
        <xsl:when test="$label != ''">
          <xsl:value-of select="label"/>
        </xsl:when>
        <xsl:when test="$name != ''">
          <xsl:value-of select="name"/>
        </xsl:when>        
        <xsl:otherwise>
          <xsl:value-of select="longflag"/>
        </xsl:otherwise>
      </xsl:choose>
    </span>
  </xsl:template>
  
  
  <!-- PARAMETERS -->
  
  <!-- IMAGE/FILE/DIRECTORY/TRANSFORM parameter -->
  <xsl:template match="image | file | directory | transform">
    <xsl:variable name="channel" select="channel"/>
    <xsl:choose>
      <xsl:when test="$channel = 'output'">
        <!-- OUTPUT CHANNEL -->
        <div class='output_row'>
          <span class='parameter_output' data-type='{local-name()}'>
            <xsl:attribute name="data-flag"><xsl:value-of select="longflag"/></xsl:attribute>
          </span>
        </div>
      </xsl:when>
      <xsl:otherwise>
        <!-- INPUT CHANNEL -->
        <div rel='left_tooltip' class='parameter_row'>
          <xsl:attribute name="title"><xsl:value-of select="description"/></xsl:attribute>   
          <span class='parameter_title' style='width:65px'>
            <xsl:value-of select="label"/>
          </span>
          <span class='parameter_batchdrop' data-type='batchdrop' style='display:none;'>
            <xsl:attribute name="data-index"><xsl:value-of select="index"/></xsl:attribute>
            <xsl:attribute name="data-flag"><xsl:value-of select="longflag"/></xsl:attribute>X
          </span>
          <span class='parameter_input parameter_dropzone' data-type='dropzone' data-default='Drag and drop here'>
            <xsl:attribute name="data-flag"><xsl:value-of select="longflag"/></xsl:attribute>
            <xsl:attribute name="data-index"><xsl:value-of select="index"/></xsl:attribute>            
            Drag and drop here</span>            
        </div>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <!-- INTEGER parameter -->
  <xsl:template match="integer">
    <div rel='left_tooltip' class='parameter_row'>
      <xsl:attribute name="title"><xsl:value-of select="description"/></xsl:attribute>          
      <xsl:call-template name="create_label"/>
      <span class='parameter_input' data-type='spinner'>
        <xsl:attribute name="data-flag"><xsl:value-of select="longflag"/></xsl:attribute>
        <input class='parameter_spinner'>  
          <xsl:attribute name="data-default"><xsl:value-of select="default"/></xsl:attribute>
          <xsl:attribute name="data-step"><xsl:value-of select="constraints/step"/></xsl:attribute>
        </input>
      </span>
    </div>
  </xsl:template>

  <!-- DOUBLE parameter -->
  <xsl:template match="double">
    <div rel='left_tooltip' class='parameter_row'>
      <xsl:attribute name="title"><xsl:value-of select="description"/></xsl:attribute>          
      <xsl:call-template name="create_label"/>
      <span class='parameter_input' data-type='spinner_double'>
        <xsl:attribute name="data-flag"><xsl:value-of select="longflag"/></xsl:attribute>
        <input class='parameter_spinner_double'>  
          <xsl:attribute name="data-default"><xsl:value-of select="default"/></xsl:attribute>
          <xsl:attribute name="data-step"><xsl:value-of select="constraints/step"/></xsl:attribute>
        </input>
      </span>
    </div>
  </xsl:template>
  
  <!-- BOOLEAN parameter -->
  <xsl:template match="boolean">
    <div rel='left_tooltip' class='parameter_row'>
      <xsl:attribute name="title"><xsl:value-of select="description"/></xsl:attribute>     
      <xsl:call-template name="create_label"/>
      <span class='parameter_input' data-type='checkbox'>
        <xsl:attribute name="data-flag"><xsl:value-of select="longflag"/></xsl:attribute>
        <input type='checkbox' class='parameter_checkbox'>
          <xsl:variable name="default" select="default"/>
          <xsl:choose>
            <xsl:when test="$default = 'true' or $default = 'True'">
              <xsl:attribute name="checked"/>
              <xsl:attribute name="data-default">true</xsl:attribute>
            </xsl:when>
            <xsl:otherwise>
              <xsl:attribute name="data-default">false</xsl:attribute>
            </xsl:otherwise>
          </xsl:choose>
        </input>
      </span>
    </div>
  </xsl:template>
  
  <!-- STRING parameter -->
  <xsl:template match="string | float-vector | integer-vector">
    <div rel='left_tooltip' class='parameter_row'>
      <xsl:attribute name="title"><xsl:value-of select="description"/></xsl:attribute>          
      <span class='parameter_title' style='width:65px;'>
        <xsl:value-of select="label"/>
      </span>
      <span class='parameter_input' data-type='string'>
        <xsl:attribute name="data-flag"><xsl:value-of select="longflag"/></xsl:attribute>
        <textarea class='parameter_string'>
          <xsl:attribute name="data-default"><xsl:value-of select="default"/></xsl:attribute>       
          _CHRIS_DEFAULT
        </textarea>
      </span>
    </div>
  </xsl:template>
    
  <!-- STRING-ENUMERATION parameter -->
  <xsl:template match="string-enumeration">
    <div rel='left_tooltip' class='parameter_row'>
      <xsl:attribute name="title"><xsl:value-of select="description"/></xsl:attribute>          
      <span class='parameter_title' style='width:85px;'>
        <xsl:value-of select="label"/>
      </span>
      <span class='parameter_input' data-type='combobox'>
        <xsl:attribute name="data-flag"><xsl:value-of select="longflag"/></xsl:attribute>
        <select class='parameter_combobox'>
          <xsl:attribute name="data-default"><xsl:value-of select="default"/></xsl:attribute>
          <xsl:for-each select="element">
            <option><xsl:value-of select="."/></option>
          </xsl:for-each>
        </select>        
      </span>
    </div>
  </xsl:template>
      
  
</xsl:stylesheet>
