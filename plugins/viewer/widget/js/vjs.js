(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.VJS = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! dicom-parser - v1.1.0 - 2015-07-20 | (c) 2014 Chris Hafey | https://github.com/chafey/dicomParser */
(function (root, factory) {

    // node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        if(typeof cornerstone === 'undefined'){
            dicomParser = {};

            // meteor
            if (typeof Package !== 'undefined') {
                root.dicomParser = dicomParser;
            }
        }
        dicomParser = factory();
    }
}(this, function () {

    /**
     * Parses a DICOM P10 byte array and returns a DataSet object with the parsed elements.  If the options
     * argument is supplied and it contains the untilTag property, parsing will stop once that
     * tag is encoutered.  This can be used to parse partial byte streams.
     *
     * @param byteArray the byte array
     * @param options object to control parsing behavior (optional)
     * @returns {DataSet}
     * @throws error if an error occurs while parsing.  The exception object will contain a property dataSet with the
     *         elements successfully parsed before the error.
     */
var dicomParser = (function(dicomParser) {
    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    dicomParser.parseDicom = function(byteArray, options) {

        if(byteArray === undefined)
        {
            throw "dicomParser.parseDicom: missing required parameter 'byteArray'";
        }

        var littleEndianByteStream = new dicomParser.ByteStream(dicomParser.littleEndianByteArrayParser, byteArray);

        function readPrefix()
        {
            littleEndianByteStream.seek(128);
            var prefix = littleEndianByteStream.readFixedString(4);
            if(prefix !== "DICM")
            {
                throw "dicomParser.parseDicom: DICM prefix not found at location 132";
            }
        }

        function readPart10Header()
        {
            // Per the DICOM standard, the header is always encoded in Explicit VR Little Endian (see PS3.10, section 7.1)
            // so use littleEndianByteStream throughout this method regardless of the transfer syntax
            readPrefix();

            var warnings = [];
            var elements = {};
            while(littleEndianByteStream.position < littleEndianByteStream.byteArray.length) {
                var position = littleEndianByteStream.position;
                var element = dicomParser.readDicomElementExplicit(littleEndianByteStream, warnings);
                if(element.tag > 'x0002ffff') {
                    littleEndianByteStream.position = position;
                    break;
                }
                // Cache the littleEndianByteArrayParser for meta header elements, since the rest of the data set may be big endian
                // and this parser will be needed later if the meta header values are to be read.
                element.parser = dicomParser.littleEndianByteArrayParser;
                elements[element.tag] = element;
            }
            var metaHeaderDataSet = new dicomParser.DataSet(littleEndianByteStream.byteArrayParser, littleEndianByteStream.byteArray, elements);
            metaHeaderDataSet.warnings = littleEndianByteStream.warnings;
            return metaHeaderDataSet;
        }

        function readTransferSyntax(metaHeaderDataSet) {
            if(metaHeaderDataSet.elements.x00020010 === undefined) {
                throw 'dicomParser.parseDicom: missing required meta header attribute 0002,0010';
            }
            var transferSyntaxElement = metaHeaderDataSet.elements.x00020010;
            return dicomParser.readFixedString(littleEndianByteStream.byteArray, transferSyntaxElement.dataOffset, transferSyntaxElement.length);
        }

        function isExplicit(transferSyntax) {
            if(transferSyntax === '1.2.840.10008.1.2') // implicit little endian
            {
                return false;
            }
            // all other transfer syntaxes should be explicit
            return true;
        }

        function getDataSetByteStream(transferSyntax) {
            if(transferSyntax === '1.2.840.10008.1.2.2') // explicit big endian
            {
                return new dicomParser.ByteStream(dicomParser.bigEndianByteArrayParser, byteArray, littleEndianByteStream.position);
            }
            else
            {
                // all other transfer syntaxes are little endian; only the pixel encoding differs
                // make a new stream so the metaheader warnings don't come along for the ride
                return new dicomParser.ByteStream(dicomParser.littleEndianByteArrayParser, byteArray, littleEndianByteStream.position);
            }
        }

        function mergeDataSets(metaHeaderDataSet, instanceDataSet)
        {
            for (var propertyName in metaHeaderDataSet.elements)
            {
                if(metaHeaderDataSet.elements.hasOwnProperty(propertyName))
                {
                    instanceDataSet.elements[propertyName] = metaHeaderDataSet.elements[propertyName];
                }
            }
            if (metaHeaderDataSet.warnings !== undefined) {
                instanceDataSet.warnings = metaHeaderDataSet.warnings.concat(instanceDataSet.warnings);
            }
            return instanceDataSet;
        }

        function readDataSet(metaHeaderDataSet)
        {
            var transferSyntax = readTransferSyntax(metaHeaderDataSet);
            var explicit = isExplicit(transferSyntax);
            var dataSetByteStream = getDataSetByteStream(transferSyntax);

            var elements = {};
            var dataSet = new dicomParser.DataSet(dataSetByteStream.byteArrayParser, dataSetByteStream.byteArray, elements);
            dataSet.warnings = dataSetByteStream.warnings;

            try{
                if(explicit) {
                    dicomParser.parseDicomDataSetExplicit(dataSet, dataSetByteStream, dataSetByteStream.byteArray.length, options);
                }
                else
                {
                    dicomParser.parseDicomDataSetImplicit(dataSet, dataSetByteStream, dataSetByteStream.byteArray.length, options);
                }
            }
            catch(e) {
                var ex = {
                    exception: e,
                    dataSet: dataSet
                };
                throw ex;
            }
            return dataSet;
        }

        // main function here
        function parseTheByteStream() {
            var metaHeaderDataSet = readPart10Header();

            var dataSet = readDataSet(metaHeaderDataSet);

            return mergeDataSets(metaHeaderDataSet, dataSet);
        }

        // This is where we actually start parsing
        return parseTheByteStream();
    };

    return dicomParser;
})(dicomParser);

var dicomParser = (function (dicomParser) {
    "use strict";

    if (dicomParser === undefined) {
        dicomParser = {};
    }

    /**
     * converts an explicit dataSet to a javascript object
     * @param dataSet
     * @param options
     */
    dicomParser.explicitDataSetToJS = function (dataSet, options) {

        if(dataSet === undefined) {
            throw 'dicomParser.explicitDataSetToJS: missing required parameter dataSet';
        }

        options = options || {
            omitPrivateAttibutes: true, // true if private elements should be omitted
            maxElementLength : 128      // maximum element length to try and convert to string format
        };

        var result = {

        };

        for(var tag in dataSet.elements) {
            var element = dataSet.elements[tag];

            // skip this element if it a private element and our options specify that we should
            if(options.omitPrivateAttibutes === true && dicomParser.isPrivateTag(tag))
            {
                continue;
            }

            if(element.items) {
                // handle sequences
                var sequenceItems = [];
                for(var i=0; i < element.items.length; i++) {
                    sequenceItems.push(dicomParser.explicitDataSetToJS(element.items[i].dataSet, options));
                }
                result[tag] = sequenceItems;
            } else {
                var asString;
                asString = undefined;
                if(element.length < options.maxElementLength) {
                    asString = dicomParser.explicitElementToString(dataSet, element);
                }

                if(asString !== undefined) {
                    result[tag] = asString;
                }  else {
                    result[tag] = {
                        dataOffset: element.dataOffset,
                        length : element.length
                    };
                }
            }
        }

        return result;
    };


    return dicomParser;
}(dicomParser));
var dicomParser = (function (dicomParser) {
    "use strict";

    if (dicomParser === undefined) {
        dicomParser = {};
    }

    /**
     * Converts an explicit VR element to a string or undefined if it is not possible to convert.
     * Throws an error if an implicit element is supplied
     * @param dataSet
     * @param element
     * @returns {*}
     */
    dicomParser.explicitElementToString = function(dataSet, element)
    {
        if(dataSet === undefined || element === undefined) {
            throw 'dicomParser.explicitElementToString: missing required parameters';
        }
        if(element.vr === undefined) {
            throw 'dicomParser.explicitElementToString: cannot convert implicit element to string';
        }
        var vr = element.vr;
        var tag = element.tag;

        var textResult;

        function multiElementToString(numItems, func) {
            var result = "";
            for(var i=0; i < numItems; i++) {
                if(i !== 0) {
                    result += '/';
                }
                result += func.call(dataSet, tag).toString();
            }
            return result;
        }

        if(dicomParser.isStringVr(vr) === true)
        {
            textResult = dataSet.string(tag);
        }
        else if (vr == 'AT') {
            var num = dataSet.uint32(tag);
            if(num === undefined) {
                return undefined;
            }
            if (num < 0)
            {
                num = 0xFFFFFFFF + num + 1;
            }

            return 'x' + num.toString(16).toUpperCase();
        }
        else if (vr == 'US')
        {
            textResult = multiElementToString(element.length / 2, dataSet.uint16);
        }
        else if(vr === 'SS')
        {
            textResult = multiElementToString(element.length / 2, dataSet.int16);
        }
        else if (vr == 'UL')
        {
            textResult = multiElementToString(element.length / 4, dataSet.uint32);
        }
        else if(vr === 'SL')
        {
            textResult = multiElementToString(element.length / 4, dataSet.int32);
        }
        else if(vr == 'FD')
        {
            textResult = multiElementToString(element.length / 8, dataSet.int32);
        }
        else if(vr == 'FL')
        {
            textResult = multiElementToString(element.length / 4, dataSet.float);
        }

        return textResult;
    };
    return dicomParser;
}(dicomParser));
/**
 * Utility functions for dealing with DICOM
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    var stringVrs = {
        AE: true,
        AS: true,
        AT: false,
        CS: true,
        DA: true,
        DS: true,
        DT: true,
        FL: false,
        FD: false,
        IS: true,
        LO: true,
        LT: true,
        OB: false,
        OD: false,
        OF: false,
        OW: false,
        PN: true,
        SH: true,
        SL: false,
        SQ: false,
        SS: false,
        ST: true,
        TM: true,
        UI: true,
        UL: false,
        UN: undefined, // dunno
        UR: true,
        US: false,
        UT: true
    };

    /**
     * Tests to see if vr is a string or not.
     * @param vr
     * @returns true if string, false it not string, undefined if unknown vr or UN type
     */
    dicomParser.isStringVr = function(vr)
    {
        return stringVrs[vr];
    };

    /**
     * Tests to see if a given tag in the format xggggeeee is a private tag or not
     * @param tag
     * @returns {boolean}
     */
    dicomParser.isPrivateTag = function(tag)
    {
        var lastGroupDigit = parseInt(tag[4]);
        var groupIsOdd = (lastGroupDigit % 2) === 1;
        return groupIsOdd;
    };

    /**
     * Parses a PN formatted string into a javascript object with properties for givenName, familyName, middleName, prefix and suffix
     * @param personName a string in the PN VR format
     * @param index
     * @returns {*} javascript object with properties for givenName, familyName, middleName, prefix and suffix or undefined if no element or data
     */
    dicomParser.parsePN = function(personName) {
        if(personName === undefined) {
            return undefined;
        }
        var stringValues = personName.split('^');
        return {
            familyName: stringValues[0],
            givenName: stringValues[1],
            middleName: stringValues[2],
            prefix: stringValues[3],
            suffix: stringValues[4]
        };
    };

    /**
     * Parses a DA formatted string into a Javascript object
     * @param date a string in the DA VR format
     * @returns {*} Javascript object with properties year, month and day or undefined if not present or not 8 bytes long
     */
    dicomParser.parseDA = function(date)
    {
        if(date && date.length === 8)
        {
            var yyyy = parseInt(date.substring(0, 4), 10);
            var mm = parseInt(date.substring(4, 6), 10);
            var dd = parseInt(date.substring(6, 8), 10);

            return {
                year: yyyy,
                month: mm,
                day: dd
            };
        }
        return undefined;
    };

    /**
     * Parses a TM formatted string into a javascript object with properties for hours, minutes, seconds and fractionalSeconds
     * @param time a string in the TM VR format
     * @returns {*} javascript object with properties for hours, minutes, seconds and fractionalSeconds or undefined if no element or data.  Missing fields are set to undefined
     */
    dicomParser.parseTM = function(time) {

        if (time.length >= 2) // must at least have HH
        {
            // 0123456789
            // HHMMSS.FFFFFF
            var hh = parseInt(time.substring(0, 2), 10);
            var mm = time.length >= 4 ? parseInt(time.substring(2, 4), 10) : undefined;
            var ss = time.length >= 6 ? parseInt(time.substring(4, 6), 10) : undefined;
            var ffffff = time.length >= 8 ? parseInt(time.substring(7, 13), 10) : undefined;

            return {
                hours: hh,
                minutes: mm,
                seconds: ss,
                fractionalSeconds: ffffff
            };
        }
        return undefined;
    };

    return dicomParser;
}(dicomParser));
/**
 * Functionality for extracting encapsulated pixel data
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    function getPixelDataFromFragments(byteStream, fragments, bufferSize)
    {
        // if there is only one fragment, return a view on this array to avoid copying
        if(fragments.length === 1) {
            return new Uint8Array(byteStream.byteArray.buffer, fragments[0].dataOffset, fragments[0].length);
        }

        // more than one fragment, combine all of the fragments into one buffer
        var pixelData = new Uint8Array(bufferSize);
        var pixelDataIndex = 0;
        for(var i=0; i < fragments.length; i++) {
            var fragmentOffset = fragments[i].dataOffset;
            for(var j=0; j < fragments[i].length; j++) {
                pixelData[pixelDataIndex++] = byteStream.byteArray[fragmentOffset++];
            }
        }

        return pixelData;
    }

    function readFragmentsUntil(byteStream, endOfFrame) {
        // Read fragments until we reach endOfFrame
        var fragments = [];
        var bufferSize = 0;
        while(byteStream.position < endOfFrame && byteStream.position < byteStream.byteArray.length) {
            var fragment = dicomParser.readSequenceItem(byteStream);
            // NOTE: we only encounter this for the sequence delimiter tag when extracting the last frame
            if(fragment.tag === 'xfffee0dd') {
                break;
            }
            fragments.push(fragment);
            byteStream.seek(fragment.length);
            bufferSize += fragment.length;
        }

        // Convert the fragments into a single pixelData buffer
        var pixelData = getPixelDataFromFragments(byteStream, fragments, bufferSize);
        return pixelData;
    }

    function readEncapsulatedPixelDataWithBasicOffsetTable(pixelDataElement, byteStream, frame) {
        //  validate that we have an offset for this frame
        var numFrames = pixelDataElement.basicOffsetTable.length;
        if(frame > numFrames) {
            throw "dicomParser.readEncapsulatedPixelData: parameter frame exceeds number of frames in basic offset table";
        }

        // move to the start of this frame
        var frameOffset = pixelDataElement.basicOffsetTable[frame];
        byteStream.seek(frameOffset);

        // Find the end of this frame
        var endOfFrameOffset = pixelDataElement.basicOffsetTable[frame + 1];
        if(endOfFrameOffset === undefined) { // special case for last frame
            endOfFrameOffset = byteStream.position + pixelDataElement.length;
        }

        // read this frame
        var pixelData = readFragmentsUntil(byteStream, endOfFrameOffset);
        return pixelData;
    }

    function readEncapsulatedDataNoBasicOffsetTable(pixelDataElement, byteStream, frame) {
        // if the basic offset table is empty, this is a single frame so make sure the requested
        // frame is 0
        if(frame !== 0) {
            throw 'dicomParser.readEncapsulatedPixelData: non zero frame specified for single frame encapsulated pixel data';
        }

        // read this frame
        var endOfFrame = byteStream.position + pixelDataElement.length;
        var pixelData = readFragmentsUntil(byteStream, endOfFrame);
        return pixelData;
    }

    /**
     * Returns the pixel data for the specified frame in an encapsulated pixel data element
     *
     * @param dataSet - the dataSet containing the encapsulated pixel data
     * @param pixelDataElement - the pixel data element (x7fe00010) to extract the frame from
     * @param frame - the zero based frame index
     * @returns Uint8Array with the encapsulated pixel data
     */
    dicomParser.readEncapsulatedPixelData = function(dataSet, pixelDataElement, frame)
    {
        if(dataSet === undefined) {
            throw "dicomParser.readEncapsulatedPixelData: missing required parameter 'dataSet'";
        }
        if(pixelDataElement === undefined) {
            throw "dicomParser.readEncapsulatedPixelData: missing required parameter 'element'";
        }
        if(frame === undefined) {
            throw "dicomParser.readEncapsulatedPixelData: missing required parameter 'frame'";
        }
        if(pixelDataElement.tag !== 'x7fe00010') {
            throw "dicomParser.readEncapsulatedPixelData: parameter 'element' refers to non pixel data tag (expected tag = x7fe00010'";
        }
        if(pixelDataElement.encapsulatedPixelData !== true) {
            throw "dicomParser.readEncapsulatedPixelData: parameter 'element' refers to pixel data element that does not have encapsulated pixel data";
        }
        if(pixelDataElement.hadUndefinedLength !== true) {
            throw "dicomParser.readEncapsulatedPixelData: parameter 'element' refers to pixel data element that does not have encapsulated pixel data";
        }
        if(pixelDataElement.basicOffsetTable === undefined) {
            throw "dicomParser.readEncapsulatedPixelData: parameter 'element' refers to pixel data element that does not have encapsulated pixel data";
        }
        if(pixelDataElement.fragments === undefined) {
            throw "dicomParser.readEncapsulatedPixelData: parameter 'element' refers to pixel data element that does not have encapsulated pixel data";
        }
        if(frame < 0) {
            throw "dicomParser.readEncapsulatedPixelData: parameter 'frame' must be >= 0";
        }

        // seek past the basic offset table (no need to parse it again since we already have)
        var byteStream = new dicomParser.ByteStream(dataSet.byteArrayParser, dataSet.byteArray, pixelDataElement.dataOffset);
        var basicOffsetTable = dicomParser.readSequenceItem(byteStream);
        if(basicOffsetTable.tag !== 'xfffee000')
        {
            throw "dicomParser.readEncapsulatedPixelData: missing basic offset table xfffee000";
        }
        byteStream.seek(basicOffsetTable.length);

        // If the basic offset table is empty (no entries), it is a single frame.  If it is not empty,
        // it has at least one frame so use the basic offset table to find the bytes
        if(pixelDataElement.basicOffsetTable.length !== 0)
        {
            return readEncapsulatedPixelDataWithBasicOffsetTable(pixelDataElement, byteStream, frame);
        }
        else
        {
            return readEncapsulatedDataNoBasicOffsetTable(pixelDataElement, byteStream, frame);
        }
    };

    return dicomParser;
}(dicomParser));

/**
 * Internal helper functions for parsing different types from a big-endian byte array
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    dicomParser.bigEndianByteArrayParser = {
        /**
         *
         * Parses an unsigned int 16 from a big-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed unsigned int 16
         * @throws error if buffer overread would occur
         * @access private
         */
        readUint16: function (byteArray, position) {
            if (position < 0) {
                throw 'bigEndianByteArrayParser.readUint16: position cannot be less than 0';
            }
            if (position + 2 > byteArray.length) {
                throw 'bigEndianByteArrayParser.readUint16: attempt to read past end of buffer';
            }
            return (byteArray[position] << 8) + byteArray[position + 1];
        },

        /**
         *
         * Parses a signed int 16 from a big-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed signed int 16
         * @throws error if buffer overread would occur
         * @access private
         */
        readInt16: function (byteArray, position) {
            if (position < 0) {
                throw 'bigEndianByteArrayParser.readInt16: position cannot be less than 0';
            }
            if (position + 2 > byteArray.length) {
                throw 'bigEndianByteArrayParser.readInt16: attempt to read past end of buffer';
            }
            var int16 = (byteArray[position] << 8) + byteArray[position + 1];
            // fix sign
            if (int16 & 0x8000) {
                int16 = int16 - 0xFFFF - 1;
            }
            return int16;
        },

        /**
         * Parses an unsigned int 32 from a big-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed unsigned int 32
         * @throws error if buffer overread would occur
         * @access private
         */
        readUint32: function (byteArray, position) {
            if (position < 0) {
                throw 'bigEndianByteArrayParser.readUint32: position cannot be less than 0';
            }

            if (position + 4 > byteArray.length) {
                throw 'bigEndianByteArrayParser.readUint32: attempt to read past end of buffer';
            }

            var uint32 = (256 * (256 * (256 * byteArray[position] +
                                              byteArray[position + 1]) +
                                              byteArray[position + 2]) +
                                              byteArray[position + 3]);

            return uint32;
        },

        /**
         * Parses a signed int 32 from a big-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed signed int 32
         * @throws error if buffer overread would occur
         * @access private
         */
        readInt32: function (byteArray, position) {
            if (position < 0) {
                throw 'bigEndianByteArrayParser.readInt32: position cannot be less than 0';
            }

            if (position + 4 > byteArray.length) {
                throw 'bigEndianByteArrayParser.readInt32: attempt to read past end of buffer';
            }

            var int32 = ((byteArray[position] << 24) +
                         (byteArray[position + 1] << 16) +
                         (byteArray[position + 2] << 8) +
                          byteArray[position + 3]);

            return int32;
        },

        /**
         * Parses 32-bit float from a big-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed 32-bit float
         * @throws error if buffer overread would occur
         * @access private
         */
        readFloat: function (byteArray, position) {
            if (position < 0) {
                throw 'bigEndianByteArrayParser.readFloat: position cannot be less than 0';
            }

            if (position + 4 > byteArray.length) {
                throw 'bigEndianByteArrayParser.readFloat: attempt to read past end of buffer';
            }

            // I am sure there is a better way than this but this should be safe
            var byteArrayForParsingFloat = new Uint8Array(4);
            byteArrayForParsingFloat[3] = byteArray[position];
            byteArrayForParsingFloat[2] = byteArray[position + 1];
            byteArrayForParsingFloat[1] = byteArray[position + 2];
            byteArrayForParsingFloat[0] = byteArray[position + 3];
            var floatArray = new Float32Array(byteArrayForParsingFloat.buffer);
            return floatArray[0];
        },

        /**
         * Parses 64-bit float from a big-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed 64-bit float
         * @throws error if buffer overread would occur
         * @access private
         */
        readDouble: function (byteArray, position) {
            if (position < 0) {
                throw 'bigEndianByteArrayParser.readDouble: position cannot be less than 0';
            }

            if (position + 8 > byteArray.length) {
                throw 'bigEndianByteArrayParser.readDouble: attempt to read past end of buffer';
            }

            // I am sure there is a better way than this but this should be safe
            var byteArrayForParsingFloat = new Uint8Array(8);
            byteArrayForParsingFloat[7] = byteArray[position];
            byteArrayForParsingFloat[6] = byteArray[position + 1];
            byteArrayForParsingFloat[5] = byteArray[position + 2];
            byteArrayForParsingFloat[4] = byteArray[position + 3];
            byteArrayForParsingFloat[3] = byteArray[position + 4];
            byteArrayForParsingFloat[2] = byteArray[position + 5];
            byteArrayForParsingFloat[1] = byteArray[position + 6];
            byteArrayForParsingFloat[0] = byteArray[position + 7];
            var floatArray = new Float64Array(byteArrayForParsingFloat.buffer);
            return floatArray[0];
        }
    };

    return dicomParser;
}(dicomParser));
/**
 * Internal helper functions common to parsing byte arrays of any type
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    /**
     * Reads a string of 8-bit characters from an array of bytes and advances
     * the position by length bytes.  A null terminator will end the string
     * but will not effect advancement of the position.  Trailing and leading
     * spaces are preserved (not trimmed)
     * @param byteArray the byteArray to read from
     * @param position the position in the byte array to read from
     * @param length the maximum number of bytes to parse
     * @returns {string} the parsed string
     * @throws error if buffer overread would occur
     * @access private
     */
    dicomParser.readFixedString = function(byteArray, position, length)
    {
        if(length < 0)
        {
            throw 'readFixedString - length cannot be less than 0';
        }

        if(position + length > byteArray.length) {
            throw 'dicomParser.readFixedString: attempt to read past end of buffer';
        }

        var result = "";
        for(var i=0; i < length; i++)
        {
            var byte = byteArray[position + i];
            if(byte === 0) {
                position +=  length;
                return result;
            }
            result += String.fromCharCode(byte);
        }

        return result;
    };


    return dicomParser;
}(dicomParser));
/**
 *
 * Internal helper class to assist with parsing. Supports reading from a byte
 * stream contained in a Uint8Array.  Example usage:
 *
 *  var byteArray = new Uint8Array(32);
 *  var byteStream = new dicomParser.ByteStream(dicomParser.littleEndianByteArrayParser, byteArray);
 *
 * */
var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    /**
     * Constructor for ByteStream objects.
     * @param byteArrayParser a parser for parsing the byte array
     * @param byteArray a Uint8Array containing the byte stream
     * @param position (optional) the position to start reading from.  0 if not specified
     * @constructor
     * @throws will throw an error if the byteArrayParser parameter is not present
     * @throws will throw an error if the byteArray parameter is not present or invalid
     * @throws will throw an error if the position parameter is not inside the byte array
     */
    dicomParser.ByteStream = function(byteArrayParser, byteArray, position) {
        if(byteArrayParser === undefined)
        {
            throw "dicomParser.ByteStream: missing required parameter 'byteArrayParser'";
        }
        if(byteArray === undefined)
        {
            throw "dicomParser.ByteStream: missing required parameter 'byteArray'";
        }
        if((byteArray instanceof Uint8Array) === false) {
            throw 'dicomParser.ByteStream: parameter byteArray is not of type Uint8Array';
        }
        if(position < 0)
        {
            throw "dicomParser.ByteStream: parameter 'position' cannot be less than 0";
        }
        if(position >= byteArray.length)
        {
            throw "dicomParser.ByteStream: parameter 'position' cannot be greater than or equal to 'byteArray' length";

        }
        this.byteArrayParser = byteArrayParser;
        this.byteArray = byteArray;
        this.position = position ? position : 0;
        this.warnings = []; // array of string warnings encountered while parsing
    };

    /**
     * Safely seeks through the byte stream.  Will throw an exception if an attempt
     * is made to seek outside of the byte array.
     * @param offset the number of bytes to add to the position
     * @throws error if seek would cause position to be outside of the byteArray
     */
    dicomParser.ByteStream.prototype.seek = function(offset)
    {
        if(this.position + offset < 0)
        {
            throw "cannot seek to position < 0";
        }
        this.position += offset;
    };

    /**
     * Returns a new ByteStream object from the current position and of the requested number of bytes
     * @param numBytes the length of the byte array for the ByteStream to contain
     * @returns {dicomParser.ByteStream}
     * @throws error if buffer overread would occur
     */
    dicomParser.ByteStream.prototype.readByteStream = function(numBytes)
    {
        if(this.position + numBytes > this.byteArray.length) {
            throw 'readByteStream - buffer overread';
        }
        var byteArrayView = new Uint8Array(this.byteArray.buffer, this.position, numBytes);
        this.position += numBytes;
        return new dicomParser.ByteStream(this.byteArrayParser, byteArrayView);
    };

    /**
     *
     * Parses an unsigned int 16 from a byte array and advances
     * the position by 2 bytes
     *
     * @returns {*} the parsed unsigned int 16
     * @throws error if buffer overread would occur
     */
    dicomParser.ByteStream.prototype.readUint16 = function()
    {
        var result = this.byteArrayParser.readUint16(this.byteArray, this.position);
        this.position += 2;
        return result;
    };

    /**
     * Parses an unsigned int 32 from a byte array and advances
     * the position by 2 bytes
     *
     * @returns {*} the parse unsigned int 32
     * @throws error if buffer overread would occur
     */
    dicomParser.ByteStream.prototype.readUint32 = function()
    {
        var result = this.byteArrayParser.readUint32(this.byteArray, this.position);
        this.position += 4;
        return result;
    };

    /**
     * Reads a string of 8-bit characters from an array of bytes and advances
     * the position by length bytes.  A null terminator will end the string
     * but will not effect advancement of the position.
     * @param length the maximum number of bytes to parse
     * @returns {string} the parsed string
     * @throws error if buffer overread would occur
     */
    dicomParser.ByteStream.prototype.readFixedString = function(length)
    {
        var result = dicomParser.readFixedString(this.byteArray, this.position, length);
        this.position += length;
        return result;
    };

    return dicomParser;
}(dicomParser));
/**
 *
 * The DataSet class encapsulates a collection of DICOM Elements and provides various functions
 * to access the data in those elements
 *
 * Rules for handling padded spaces:
 * DS = Strip leading and trailing spaces
 * DT = Strip trailing spaces
 * IS = Strip leading and trailing spaces
 * PN = Strip trailing spaces
 * TM = Strip trailing spaces
 * AE = Strip leading and trailing spaces
 * CS = Strip leading and trailing spaces
 * SH = Strip leading and trailing spaces
 * LO = Strip leading and trailing spaces
 * LT = Strip trailing spaces
 * ST = Strip trailing spaces
 * UT = Strip trailing spaces
 *
 */
var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    function getByteArrayParser(element, defaultParser)
    {
        return (element.parser !== undefined ? element.parser : defaultParser);
    }

    /**
     * Constructs a new DataSet given byteArray and collection of elements
     * @param byteArrayParser
     * @param byteArray
     * @param elements
     * @constructor
     */
    dicomParser.DataSet = function(byteArrayParser, byteArray, elements)
    {
        this.byteArrayParser = byteArrayParser;
        this.byteArray = byteArray;
        this.elements = elements;
    };

    /**
     * Finds the element for tag and returns an unsigned int 16 if it exists and has data
     * @param tag The DICOM tag in the format xGGGGEEEE
     * @param index the index of the value in a multivalued element.  Default is index 0 if not supplied
     * @returns {*} unsigned int 16 or undefined if the attribute is not present or has data of length 0
     */
    dicomParser.DataSet.prototype.uint16 = function(tag, index)
    {
        var element = this.elements[tag];
        index = (index !== undefined) ? index : 0;
        if(element && element.length !== 0)
        {
            return getByteArrayParser(element, this.byteArrayParser).readUint16(this.byteArray, element.dataOffset + (index *2));
        }
        return undefined;
    };

    /**
     * Finds the element for tag and returns an signed int 16 if it exists and has data
     * @param tag The DICOM tag in the format xGGGGEEEE
     * @param index the index of the value in a multivalued element.  Default is index 0 if not supplied
     * @returns {*} signed int 16 or undefined if the attribute is not present or has data of length 0
     */
    dicomParser.DataSet.prototype.int16 = function(tag, index)
    {
        var element = this.elements[tag];
        index = (index !== undefined) ? index : 0;
        if(element && element.length !== 0)
        {
            return getByteArrayParser(element, this.byteArrayParser).readInt16(this.byteArray, element.dataOffset + (index * 2));
        }
        return undefined;
    };

    /**
     * Finds the element for tag and returns an unsigned int 32 if it exists and has data
     * @param tag The DICOM tag in the format xGGGGEEEE
     * @param index the index of the value in a multivalued element.  Default is index 0 if not supplied
     * @returns {*} unsigned int 32 or undefined if the attribute is not present or has data of length 0
     */
    dicomParser.DataSet.prototype.uint32 = function(tag, index)
    {
        var element = this.elements[tag];
        index = (index !== undefined) ? index : 0;
        if(element && element.length !== 0)
        {
            return getByteArrayParser(element, this.byteArrayParser).readUint32(this.byteArray, element.dataOffset + (index * 4));
        }
        return undefined;
    };

    /**
     * Finds the element for tag and returns an signed int 32 if it exists and has data
     * @param tag The DICOM tag in the format xGGGGEEEE
     * @param index the index of the value in a multivalued element.  Default is index 0 if not supplied
     * @returns {*} signed int 32 or undefined if the attribute is not present or has data of length 0
     */
    dicomParser.DataSet.prototype.int32 = function(tag, index)
    {
        var element = this.elements[tag];
        index = (index !== undefined) ? index : 0;
        if(element && element.length !== 0)
        {
            return getByteArrayParser(element, this.byteArrayParser).readInt32(this.byteArray, element.dataOffset + (index * 4));
        }
        return undefined;
    };

    /**
     * Finds the element for tag and returns a 32 bit floating point number (VR=FL) if it exists and has data
     * @param tag The DICOM tag in the format xGGGGEEEE
     * @param index the index of the value in a multivalued element.  Default is index 0 if not supplied
     * @returns {*} float or undefined if the attribute is not present or has data of length 0
     */
    dicomParser.DataSet.prototype.float = function(tag, index)
    {
        var element = this.elements[tag];
        index = (index !== undefined) ? index : 0;
        if(element && element.length !== 0)
        {
            return getByteArrayParser(element, this.byteArrayParser).readFloat(this.byteArray, element.dataOffset + (index * 4));
        }
        return undefined;
    };

    /**
     * Finds the element for tag and returns a 64 bit floating point number (VR=FD) if it exists and has data
     * @param tag The DICOM tag in the format xGGGGEEEE
     * @param index the index of the value in a multivalued element.  Default is index 0 if not supplied
     * @returns {*} float or undefined if the attribute is not present or doesn't has data of length 0
     */
    dicomParser.DataSet.prototype.double = function(tag, index)
    {
        var element = this.elements[tag];
        index = (index !== undefined) ? index : 0;
        if(element && element.length !== 0)
        {
            return getByteArrayParser(element, this.byteArrayParser).readDouble(this.byteArray, element.dataOffset + (index * 8));
        }
        return undefined;
    };

    /**
     * Returns the number of string values for the element
     * @param tag The DICOM tag in the format xGGGGEEEE
     * @returns {*} the number of string values or undefined if the attribute is not present or has zero length data
     */
    dicomParser.DataSet.prototype.numStringValues = function(tag)
    {
        var element = this.elements[tag];
        if(element && element.length > 0)
        {
            var fixedString = dicomParser.readFixedString(this.byteArray, element.dataOffset, element.length);
            var numMatching = fixedString.match(/\\/g);
            if(numMatching === null)
            {
                return 1;
            }
            return numMatching.length + 1;
        }
        return undefined;
    };

    /**
     * Returns a string for the element.  If index is provided, the element is assumed to be
     * multi-valued and will return the component specified by index.  Undefined is returned
     * if there is no component with the specified index, the element does not exist or is zero length.
     *
     * Use this function for VR types of AE, CS, SH and LO
     *
     * @param tag The DICOM tag in the format xGGGGEEEE
     * @param index the index of the desired value in a multi valued string or undefined for the entire string
     * @returns {*}
     */
    dicomParser.DataSet.prototype.string = function(tag, index)
    {
        var element = this.elements[tag];
        if(element && element.length > 0)
        {
            var fixedString = dicomParser.readFixedString(this.byteArray, element.dataOffset, element.length);
            if(index >= 0)
            {
                var values = fixedString.split('\\');
                // trim trailing spaces
                return values[index].trim();
            }
            else
            {
                // trim trailing spaces
                return fixedString.trim();
            }
        }
        return undefined;
    };

    /**
     * Returns a string with the leading spaces preserved and trailing spaces removed.
     *
     * Use this function to access data for VRs of type UT, ST and LT
     *
     * @param tag
     * @param index
     * @returns {*}
     */
    dicomParser.DataSet.prototype.text = function(tag, index)
    {
        var element = this.elements[tag];
        if(element && element.length > 0)
        {
            var fixedString = dicomParser.readFixedString(this.byteArray, element.dataOffset, element.length);
            if(index >= 0)
            {
                var values = fixedString.split('\\');
                return values[index].replace(/ +$/, '');
            }
            else
            {
                return fixedString.replace(/ +$/, '');
            }
        }
        return undefined;
    };

    /**
     * Parses a string to a float for the specified index in a multi-valued element.  If index is not specified,
     * the first value in a multi-valued VR will be parsed if present.
     * @param tag The DICOM tag in the format xGGGGEEEE
     * @param index the index of the desired value in a multi valued string or undefined for the first value
     * @returns {*} a floating point number or undefined if not present or data not long enough
     */
    dicomParser.DataSet.prototype.floatString = function(tag, index)
    {
        var element = this.elements[tag];
        if(element && element.length > 0)
        {
            index = (index !== undefined) ? index : 0;
            var value = this.string(tag, index);
            if(value !== undefined) {
                return parseFloat(value);
            }
        }
        return undefined;
    };

    /**
     * Parses a string to an integer for the specified index in a multi-valued element.  If index is not specified,
     * the first value in a multi-valued VR will be parsed if present.
     * @param tag The DICOM tag in the format xGGGGEEEE
     * @param index the index of the desired value in a multi valued string or undefined for the first value
     * @returns {*} an integer or undefined if not present or data not long enough
     */
    dicomParser.DataSet.prototype.intString = function(tag, index)
    {
        var element = this.elements[tag];
        if(element && element.length > 0) {
            index = (index !== undefined) ? index : 0;
            var value = this.string(tag, index);
            if(value !== undefined) {
                return parseInt(value);
            }
        }
        return undefined;
    };

    //dicomParser.DataSet = DataSet;

    return dicomParser;
}(dicomParser));
/**
 * Internal helper functions for parsing DICOM elements
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    /**
     * Reads an encapsulated pixel data element and adds an array of fragments to the element
     * containing the offset and length of each fragment and any offsets from the basic offset
     * table
     * @param byteStream
     * @param element
     */
    dicomParser.findEndOfEncapsulatedElement = function(byteStream, element, warnings)
    {
        if(byteStream === undefined)
        {
            throw "dicomParser.findEndOfEncapsulatedElement: missing required parameter 'byteStream'";
        }
        if(element === undefined)
        {
            throw "dicomParser.findEndOfEncapsulatedElement: missing required parameter 'element'";
        }

        element.encapsulatedPixelData = true;
        element.basicOffsetTable = [];
        element.fragments = [];
        var basicOffsetTableItemTag = dicomParser.readTag(byteStream);
        if(basicOffsetTableItemTag !== 'xfffee000') {
            throw "dicomParser.findEndOfEncapsulatedElement: basic offset table not found";
        }
        var basicOffsetTableItemlength = byteStream.readUint32();
        var numFragments = basicOffsetTableItemlength / 4;
        for(var i =0; i < numFragments; i++) {
            var offset = byteStream.readUint32();
            element.basicOffsetTable.push(offset);
        }
        var baseOffset = byteStream.position;

        while(byteStream.position < byteStream.byteArray.length)
        {
            var tag = dicomParser.readTag(byteStream);
            var length = byteStream.readUint32();
            if(tag === 'xfffee0dd')
            {
                byteStream.seek(length);
                element.length = byteStream.position - element.dataOffset;
                return;
            }
            else if(tag === 'xfffee000')
            {
                element.fragments.push({
                    offset: byteStream.position - baseOffset - 8,
                    position : byteStream.position,
                    length : length
                });
            }
            else {
                if(warnings) {
                    warnings.push('unexpected tag ' + tag + ' while searching for end of pixel data element with undefined length');
                }
                if(length > byteStream.byteArray.length - byteStream.position)
                {
                    // fix length
                    length = byteStream.byteArray.length - byteStream.position;
                }
                element.fragments.push({
                    offset: byteStream.position - baseOffset - 8,
                    position : byteStream.position,
                    length : length
                });
                byteStream.seek(length);
                element.length = byteStream.position - element.dataOffset;
                return;
            }

            byteStream.seek(length);
        }

        if(warnings) {
            warnings.push("pixel data element " + element.tag + " missing sequence delimiter tag xfffee0dd");
        }
    };


    return dicomParser;
}(dicomParser));
/**
 * Internal helper functions for parsing DICOM elements
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    /**
     * reads from the byte stream until it finds the magic numbers for the item delimitation item
     * and then sets the length of the element
     * @param byteStream
     * @param element
     */
    dicomParser.findItemDelimitationItemAndSetElementLength = function(byteStream, element)
    {
        if(byteStream === undefined)
        {
            throw "dicomParser.readDicomElementImplicit: missing required parameter 'byteStream'";
        }

        var itemDelimitationItemLength = 8; // group, element, length
        var maxPosition = byteStream.byteArray.length - itemDelimitationItemLength;
        while(byteStream.position <= maxPosition)
        {
            var groupNumber = byteStream.readUint16();
            if(groupNumber === 0xfffe)
            {
                var elementNumber = byteStream.readUint16();
                if(elementNumber === 0xe00d)
                {
                    // NOTE: It would be better to also check for the length to be 0 as part of the check above
                    // but we will just log a warning for now
                    var itemDelimiterLength = byteStream.readUint32(); // the length
                    if(itemDelimiterLength !== 0) {
                        byteStream.warnings('encountered non zero length following item delimiter at position' + byteStream.position - 4 + " while reading element of undefined length with tag ' + element.tag");
                    }
                    element.length = byteStream.position - element.dataOffset;
                    return;

                }
            }
        }

        // No item delimitation item - silently set the length to the end of the buffer and set the position past the end of the buffer
        element.length = byteStream.byteArray.length - element.dataOffset;
        byteStream.seek(byteStream.byteArray.length - byteStream.position);
    };


    return dicomParser;
}(dicomParser));
/**
 * Internal helper functions for parsing different types from a little-endian byte array
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    dicomParser.littleEndianByteArrayParser = {
        /**
         *
         * Parses an unsigned int 16 from a little-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed unsigned int 16
         * @throws error if buffer overread would occur
         * @access private
         */
        readUint16: function (byteArray, position) {
            if (position < 0) {
                throw 'littleEndianByteArrayParser.readUint16: position cannot be less than 0';
            }
            if (position + 2 > byteArray.length) {
                throw 'littleEndianByteArrayParser.readUint16: attempt to read past end of buffer';
            }
            return byteArray[position] + (byteArray[position + 1] * 256);
        },

        /**
         *
         * Parses a signed int 16 from a little-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed signed int 16
         * @throws error if buffer overread would occur
         * @access private
         */
        readInt16: function (byteArray, position) {
            if (position < 0) {
                throw 'littleEndianByteArrayParser.readInt16: position cannot be less than 0';
            }
            if (position + 2 > byteArray.length) {
                throw 'littleEndianByteArrayParser.readInt16: attempt to read past end of buffer';
            }
            var int16 = byteArray[position] + (byteArray[position + 1] << 8);
            // fix sign
            if (int16 & 0x8000) {
                int16 = int16 - 0xFFFF - 1;
            }
            return int16;
        },


        /**
         * Parses an unsigned int 32 from a little-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed unsigned int 32
         * @throws error if buffer overread would occur
         * @access private
         */
        readUint32: function (byteArray, position) {
            if (position < 0) {
                throw 'littleEndianByteArrayParser.readUint32: position cannot be less than 0';
            }

            if (position + 4 > byteArray.length) {
                throw 'littleEndianByteArrayParser.readUint32: attempt to read past end of buffer';
            }

            var uint32 = (byteArray[position] +
            (byteArray[position + 1] * 256) +
            (byteArray[position + 2] * 256 * 256) +
            (byteArray[position + 3] * 256 * 256 * 256 ));

            return uint32;
        },

        /**
         * Parses a signed int 32 from a little-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed unsigned int 32
         * @throws error if buffer overread would occur
         * @access private
         */
        readInt32: function (byteArray, position) {
            if (position < 0) {
                throw 'littleEndianByteArrayParser.readInt32: position cannot be less than 0';
            }

            if (position + 4 > byteArray.length) {
                throw 'littleEndianByteArrayParser.readInt32: attempt to read past end of buffer';
            }

            var int32 = (byteArray[position] +
            (byteArray[position + 1] << 8) +
            (byteArray[position + 2] << 16) +
            (byteArray[position + 3] << 24));

            return int32;

        },

        /**
         * Parses 32-bit float from a little-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed 32-bit float
         * @throws error if buffer overread would occur
         * @access private
         */
        readFloat: function (byteArray, position) {
            if (position < 0) {
                throw 'littleEndianByteArrayParser.readFloat: position cannot be less than 0';
            }

            if (position + 4 > byteArray.length) {
                throw 'littleEndianByteArrayParser.readFloat: attempt to read past end of buffer';
            }

            // I am sure there is a better way than this but this should be safe
            var byteArrayForParsingFloat = new Uint8Array(4);
            byteArrayForParsingFloat[0] = byteArray[position];
            byteArrayForParsingFloat[1] = byteArray[position + 1];
            byteArrayForParsingFloat[2] = byteArray[position + 2];
            byteArrayForParsingFloat[3] = byteArray[position + 3];
            var floatArray = new Float32Array(byteArrayForParsingFloat.buffer);
            return floatArray[0];
        },

        /**
         * Parses 64-bit float from a little-endian byte array
         *
         * @param byteArray the byte array to read from
         * @param position the position in the byte array to read from
         * @returns {*} the parsed 64-bit float
         * @throws error if buffer overread would occur
         * @access private
         */
        readDouble: function (byteArray, position) {
            if (position < 0) {
                throw 'littleEndianByteArrayParser.readDouble: position cannot be less than 0';
            }

            if (position + 8 > byteArray.length) {
                throw 'littleEndianByteArrayParser.readDouble: attempt to read past end of buffer';
            }

            // I am sure there is a better way than this but this should be safe
            var byteArrayForParsingFloat = new Uint8Array(8);
            byteArrayForParsingFloat[0] = byteArray[position];
            byteArrayForParsingFloat[1] = byteArray[position + 1];
            byteArrayForParsingFloat[2] = byteArray[position + 2];
            byteArrayForParsingFloat[3] = byteArray[position + 3];
            byteArrayForParsingFloat[4] = byteArray[position + 4];
            byteArrayForParsingFloat[5] = byteArray[position + 5];
            byteArrayForParsingFloat[6] = byteArray[position + 6];
            byteArrayForParsingFloat[7] = byteArray[position + 7];
            var floatArray = new Float64Array(byteArrayForParsingFloat.buffer);
            return floatArray[0];
        }
    };

    return dicomParser;
}(dicomParser));
/**
 * Internal helper functions for parsing implicit and explicit DICOM data sets
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    /**
     * reads an explicit data set
     * @param byteStream the byte stream to read from
     * @param maxPosition the maximum position to read up to (optional - only needed when reading sequence items)
     */
    dicomParser.parseDicomDataSetExplicit = function (dataSet, byteStream, maxPosition, options) {

        maxPosition = (maxPosition === undefined) ? byteStream.byteArray.length : maxPosition ;
        options = options || {};

        if(byteStream === undefined)
        {
            throw "dicomParser.parseDicomDataSetExplicit: missing required parameter 'byteStream'";
        }
        if(maxPosition < byteStream.position || maxPosition > byteStream.byteArray.length)
        {
            throw "dicomParser.parseDicomDataSetExplicit: invalid value for parameter 'maxPosition'";
        }
        var elements = dataSet.elements;

        while(byteStream.position < maxPosition)
        {
            var element = dicomParser.readDicomElementExplicit(byteStream, dataSet.warnings, options.untilTag);
            elements[element.tag] = element;
            if(element.tag === options.untilTag) {
                return;
            }
        }
        if(byteStream.position > maxPosition) {
            throw "dicomParser:parseDicomDataSetExplicit: buffer overrun";
        }
    };

    /**
     * reads an implicit data set
     * @param byteStream the byte stream to read from
     * @param maxPosition the maximum position to read up to (optional - only needed when reading sequence items)
     */
    dicomParser.parseDicomDataSetImplicit = function(dataSet, byteStream, maxPosition, options)
    {
        maxPosition = (maxPosition === undefined) ? dataSet.byteArray.length : maxPosition ;
        options = options || {};

        if(byteStream === undefined)
        {
            throw "dicomParser.parseDicomDataSetImplicit: missing required parameter 'byteStream'";
        }
        if(maxPosition < byteStream.position || maxPosition > byteStream.byteArray.length)
        {
            throw "dicomParser.parseDicomDataSetImplicit: invalid value for parameter 'maxPosition'";
        }

        var elements = dataSet.elements;

        while(byteStream.position < maxPosition)
        {
            var element = dicomParser.readDicomElementImplicit(byteStream, options.untilTag);
            elements[element.tag] = element;
            if(element.tag === options.untilTag) {
                return;
            }
        }
    };

    return dicomParser;
}(dicomParser));

/**
 * Internal helper functions for for parsing DICOM elements
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    function getDataLengthSizeInBytesForVR(vr)
    {
        if( vr === 'OB' ||
            vr === 'OW' ||
            vr === 'SQ' ||
            vr === 'OF' ||
            vr === 'UT' ||
            vr === 'UN')
        {
            return 4;
        }
        else
        {
            return 2;
        }
    }

    dicomParser.readDicomElementExplicit = function(byteStream, warnings, untilTag)
    {
        if(byteStream === undefined)
        {
            throw "dicomParser.readDicomElementExplicit: missing required parameter 'byteStream'";
        }

        var element = {
            tag : dicomParser.readTag(byteStream),
            vr : byteStream.readFixedString(2)
            // length set below based on VR
            // dataOffset set below based on VR and size of length
        };

        var dataLengthSizeBytes = getDataLengthSizeInBytesForVR(element.vr);
        if(dataLengthSizeBytes === 2)
        {
            element.length = byteStream.readUint16();
            element.dataOffset = byteStream.position;
        }
        else
        {
            byteStream.seek(2);
            element.length = byteStream.readUint32();
            element.dataOffset = byteStream.position;
        }

        if(element.length === 4294967295)
        {
            element.hadUndefinedLength = true;
        }

        if(element.tag === untilTag) {
            return element;
        }

        // if VR is SQ, parse the sequence items
        if(element.vr === 'SQ')
        {
            dicomParser.readSequenceItemsExplicit(byteStream, element, warnings);
            return element;
        }
        if(element.length === 4294967295)
        {
            if(element.tag === 'x7fe00010') {
                dicomParser.findEndOfEncapsulatedElement(byteStream, element, warnings);
                return element;
            } else {
                dicomParser.findItemDelimitationItemAndSetElementLength(byteStream, element);
                return element;
            }
        }

        byteStream.seek(element.length);
        return element;
    };

    return dicomParser;
}(dicomParser));
/**
 * Internal helper functions for for parsing DICOM elements
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    dicomParser.readDicomElementImplicit = function(byteStream, untilTag)
    {
        if(byteStream === undefined)
        {
            throw "dicomParser.readDicomElementImplicit: missing required parameter 'byteStream'";
        }

        var element = {
            tag : dicomParser.readTag(byteStream),
            length: byteStream.readUint32(),
            dataOffset :  byteStream.position
        };

        if(element.length === 4294967295)
        {
            element.hadUndefinedLength = true;
        }

        if(element.tag === untilTag) {
            return element;
        }

        // peek ahead at the next tag to see if it looks like a sequence.  This is not 100%
        // safe because a non sequence item could have data that has these bytes, but this
        // is how to do it without a data dictionary.
        if ((byteStream.position + 4) <= byteStream.byteArray.length) {
            var nextTag = dicomParser.readTag(byteStream);
            byteStream.seek(-4);

            if (nextTag === 'xfffee000') {
                // parse the sequence
                dicomParser.readSequenceItemsImplicit(byteStream, element);
                //element.length = byteStream.byteArray.length - element.dataOffset;
                return element;
            }
        }

        // if element is not a sequence and has undefined length, we have to
        // scan the data for a magic number to figure out when it ends.
        if(element.length === 4294967295)
        {
            dicomParser.findItemDelimitationItemAndSetElementLength(byteStream, element);
            return element;
        }

        // non sequence element with known length, skip over the data part
        byteStream.seek(element.length);
        return element;
    };


    return dicomParser;
}(dicomParser));
/**
 * Internal helper functions for parsing DICOM elements
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    function readDicomDataSetExplicitUndefinedLength(byteStream, warnings)
    {
        var elements = {};

        while(byteStream.position < byteStream.byteArray.length)
        {
            var element = dicomParser.readDicomElementExplicit(byteStream, warnings);
            elements[element.tag] = element;

            // we hit an item delimiter tag, return the current offset to mark
            // the end of this sequence item
            if(element.tag === 'xfffee00d')
            {
                return new dicomParser.DataSet(byteStream.byteArrayParser, byteStream.byteArray, elements);
            }

        }

        // eof encountered - log a warning and return what we have for the element
        byteStream.warnings.push('eof encountered before finding sequence delimitation item while reading sequence item of undefined length');
        return new dicomParser.DataSet(byteStream.byteArrayParser, byteStream.byteArray, elements);
    }

    function readSequenceItemExplicit(byteStream, warnings)
    {
        var item = dicomParser.readSequenceItem(byteStream);

        if(item.length === 4294967295)
        {
            item.hadUndefinedLength = true;
            item.dataSet = readDicomDataSetExplicitUndefinedLength(byteStream, warnings);
            item.length = byteStream.position - item.dataOffset;
        }
        else
        {
            item.dataSet = new dicomParser.DataSet(byteStream.byteArrayParser, byteStream.byteArray, {});
            dicomParser.parseDicomDataSetExplicit(item.dataSet, byteStream, byteStream.position + item.length);
        }
        return item;
    }

    function readSQElementUndefinedLengthExplicit(byteStream, element, warnings)
    {
        while(byteStream.position < byteStream.byteArray.length)
        {
            var item = readSequenceItemExplicit(byteStream, warnings);
            element.items.push(item);

            // If this is the sequence delimitation item, return the offset of the next element
            if(item.tag === 'xfffee0dd')
            {
                // sequence delimitation item, update attr data length and return
                element.length = byteStream.position - element.dataOffset;
                return;
            }
        }

        // eof encountered - log a warning and set the length of the element based on the buffer size
        byteStream.warnings.push('eof encountered before finding sequence delimitation item in sequence element of undefined length with tag ' + element.tag);
        element.length = byteStream.byteArray.length - element.dataOffset;
    }

    function readSQElementKnownLengthExplicit(byteStream, element, warnings)
    {
        var maxPosition = element.dataOffset + element.length;
        while(byteStream.position < maxPosition)
        {
            var item = readSequenceItemExplicit(byteStream, warnings);
            element.items.push(item);
        }
    }

    dicomParser.readSequenceItemsExplicit = function(byteStream, element, warnings)
    {
        if(byteStream === undefined)
        {
            throw "dicomParser.readSequenceItemsExplicit: missing required parameter 'byteStream'";
        }
        if(element === undefined)
        {
            throw "dicomParser.readSequenceItemsExplicit: missing required parameter 'element'";
        }

        element.items = [];

        if(element.length === 4294967295)
        {
            readSQElementUndefinedLengthExplicit(byteStream, element);
        }
        else
        {
            readSQElementKnownLengthExplicit(byteStream, element, warnings);
        }
    };


    return dicomParser;
}(dicomParser));
/**
 * Internal helper functions for parsing DICOM elements
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    function readDicomDataSetImplicitUndefinedLength(byteStream)
    {
        var elements = {};

        while(byteStream.position < byteStream.byteArray.length)
        {
            var element = dicomParser.readDicomElementImplicit(byteStream);
            elements[element.tag] = element;

            // we hit an item delimiter tag, return the current offset to mark
            // the end of this sequence item
            if(element.tag === 'xfffee00d')
            {
                return new dicomParser.DataSet(byteStream.byteArrayParser, byteStream.byteArray, elements);
            }
        }
        // eof encountered - log a warning and return what we have for the element
        byteStream.warnings.push('eof encountered before finding sequence item delimiter in sequence item of undefined length');
        return new dicomParser.DataSet(byteStream.byteArrayParser, byteStream.byteArray, elements);
    }

    function readSequenceItemImplicit(byteStream)
    {
        var item = dicomParser.readSequenceItem(byteStream);

        if(item.length === 4294967295)
        {
            item.hadUndefinedLength = true;
            item.dataSet = readDicomDataSetImplicitUndefinedLength(byteStream);
            item.length = byteStream.position - item.dataOffset;
        }
        else
        {
            item.dataSet = new dicomParser.DataSet(byteStream.byteArrayParser, byteStream.byteArray, {});
            dicomParser.parseDicomDataSetImplicit(item.dataSet, byteStream, byteStream.position + item.length);
        }
        return item;
    }

    function readSQElementUndefinedLengthImplicit(byteStream, element)
    {
        while(byteStream.position < byteStream.byteArray.length)
        {
            var item = readSequenceItemImplicit(byteStream);
            element.items.push(item);

            // If this is the sequence delimitation item, return the offset of the next element
            if(item.tag === 'xfffee0dd')
            {
                // sequence delimitation item, update attr data length and return
                element.length = byteStream.position - element.dataOffset;
                return;
            }
        }

        // eof encountered - log a warning and set the length of the element based on the buffer size
        byteStream.warnings.push('eof encountered before finding sequence delimitation item in sequence of undefined length');
        element.length = byteStream.byteArray.length - element.dataOffset;
    }

    function readSQElementKnownLengthImplicit(byteStream, element)
    {
        var maxPosition = element.dataOffset + element.length;
        while(byteStream.position < maxPosition)
        {
            var item = readSequenceItemImplicit(byteStream);
            element.items.push(item);
        }
    }

    /**
     * Reads sequence items for an element in an implicit little endian byte stream
     * @param byteStream the implicit little endian byte stream
     * @param element the element to read the sequence items for
     */
    dicomParser.readSequenceItemsImplicit = function(byteStream, element)
    {
        if(byteStream === undefined)
        {
            throw "dicomParser.readSequenceItemsImplicit: missing required parameter 'byteStream'";
        }
        if(element === undefined)
        {
            throw "dicomParser.readSequenceItemsImplicit: missing required parameter 'element'";
        }

        element.items = [];

        if(element.length === 4294967295)
        {
            readSQElementUndefinedLengthImplicit(byteStream, element);
        }
        else
        {
            readSQElementKnownLengthImplicit(byteStream, element);
        }
    };

    return dicomParser;
}(dicomParser));
/**
 * Internal helper functions for parsing DICOM elements
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    /**
     * Reads the tag and length of a sequence item and returns them as an object with the following properties
     *  tag : string for the tag of this element in the format xggggeeee
     *  length: the number of bytes in this item or 4294967295 if undefined
     *  dataOffset: the offset into the byteStream of the data for this item
     * @param byteStream the byte
     * @returns {{tag: string, length: integer, dataOffset: integer}}
     */
    dicomParser.readSequenceItem = function(byteStream)
    {
        if(byteStream === undefined)
        {
            throw "dicomParser.readSequenceItem: missing required parameter 'byteStream'";
        }

        var element = {
            tag : dicomParser.readTag(byteStream),
            length : byteStream.readUint32(),
            dataOffset :  byteStream.position
        };

        return element;
    };


    return dicomParser;
}(dicomParser));
/**
 * Internal helper functions for parsing DICOM elements
 */

var dicomParser = (function (dicomParser)
{
    "use strict";

    if(dicomParser === undefined)
    {
        dicomParser = {};
    }

    /**
     * Reads a tag (group number and element number) from a byteStream
     * @param byteStream the byte stream to read from
     * @returns {string} the tag in format xggggeeee where gggg is the lowercase hex value of the group number
     * and eeee is the lower case hex value of the element number
     */
    dicomParser.readTag = function(byteStream)
    {
        if(byteStream === undefined)
        {
            throw "dicomParser.readTag: missing required parameter 'byteStream'";
        }

        var groupNumber =  byteStream.readUint16() * 256 * 256;
        var elementNumber = byteStream.readUint16();
        var tag = "x" + ('00000000' + (groupNumber + elementNumber).toString(16)).substr(-8);
        return tag;
    };

    return dicomParser;
}(dicomParser));
    return dicomParser;
}));

},{}],2:[function(require,module,exports){
/*
 * Copyright (C) 2015 Michael Martinez
 * Changes: Added support for selection values 2-7, fixed minor bugs &
 * warnings, split into multiple class files, and general clean up.
 *
 * 08-25-2015: Helmut Dersch agreed to a license change from LGPL to MIT.
 */

/*
 * Copyright (C) Helmut Dersch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/
var jpeg = jpeg || {};
jpeg.lossless = jpeg.lossless || {};


/*** Constructor ***/
jpeg.lossless.ComponentSpec = jpeg.lossless.ComponentSpec || function () {
    this.hSamp = 0; // Horizontal sampling factor
    this.quantTableSel = 0; // Quantization table destination selector
    this.vSamp = 0; // Vertical
};


/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = jpeg.lossless.ComponentSpec;
}

},{}],3:[function(require,module,exports){
/*
 * Copyright (C) 2015 Michael Martinez
 * Changes: Added support for selection values 2-7, fixed minor bugs &
 * warnings, split into multiple class files, and general clean up.
 *
 * 08-25-2015: Helmut Dersch agreed to a license change from LGPL to MIT.
 */

/*
 * Copyright (C) Helmut Dersch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/
var jpeg = jpeg || {};
jpeg.lossless = jpeg.lossless || {};


/*** Constructor ***/
jpeg.lossless.DataStream = jpeg.lossless.DataStream || function (data, offset, length) {
    this.buffer = new DataView(data, offset, length);
    this.index = 0;
};



jpeg.lossless.DataStream.prototype.get16 = function () {
    var value = this.buffer.getUint16(this.index, false);
    this.index += 2;
    return value;
};



jpeg.lossless.DataStream.prototype.get8 = function () {
    var value = this.buffer.getUint8(this.index);
    this.index += 1;
    return value;
};


/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = jpeg.lossless.DataStream;
}

},{}],4:[function(require,module,exports){
/*
 * Copyright (C) 2015 Michael Martinez
 * Changes: Added support for selection values 2-7, fixed minor bugs &
 * warnings, split into multiple class files, and general clean up.
 *
 * 08-25-2015: Helmut Dersch agreed to a license change from LGPL to MIT.
 */

/*
 * Copyright (C) Helmut Dersch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/
var jpeg = jpeg || {};
jpeg.lossless = jpeg.lossless || {};
jpeg.lossless.DataStream = jpeg.lossless.DataStream || ((typeof require !== 'undefined') ? require('./data-stream.js') : null);
jpeg.lossless.HuffmanTable = jpeg.lossless.HuffmanTable || ((typeof require !== 'undefined') ? require('./huffman-table.js') : null);
jpeg.lossless.QuantizationTable = jpeg.lossless.QuantizationTable || ((typeof require !== 'undefined') ? require('./quantization-table.js') : null);
jpeg.lossless.ScanHeader = jpeg.lossless.ScanHeader || ((typeof require !== 'undefined') ? require('./scan-header.js') : null);
jpeg.lossless.FrameHeader = jpeg.lossless.FrameHeader || ((typeof require !== 'undefined') ? require('./frame-header.js') : null);
jpeg.lossless.Utils = jpeg.lossless.Utils || ((typeof require !== 'undefined') ? require('./utils.js') : null);


/*** Constructor ***/
jpeg.lossless.Decoder = jpeg.lossless.Decoder || function (buffer, numBytes) {
    this.buffer = buffer;
    this.frame = new jpeg.lossless.FrameHeader();
    this.huffTable = new jpeg.lossless.HuffmanTable();
    this.quantTable = new jpeg.lossless.QuantizationTable();
    this.scan = new jpeg.lossless.ScanHeader();
    this.DU = jpeg.lossless.Utils.createArray(10, 4, 64); // at most 10 data units in a MCU, at most 4 data units in one component
    this.HuffTab = jpeg.lossless.Utils.createArray(4, 2, 50 * 256);
    this.IDCT_Source = [];
    this.nBlock = []; // number of blocks in the i-th Comp in a scan
    this.acTab = jpeg.lossless.Utils.createArray(10, 1); // ac HuffTab for the i-th Comp in a scan
    this.dcTab = jpeg.lossless.Utils.createArray(10, 1); // dc HuffTab for the i-th Comp in a scan
    this.qTab = jpeg.lossless.Utils.createArray(10, 1); // quantization table for the i-th Comp in a scan
    this.marker = 0;
    this.markerIndex = 0;
    this.numComp = 0;
    this.restartInterval = 0;
    this.selection = 0;
    this.xDim = 0;
    this.yDim = 0;
    this.xLoc = 0;
    this.yLoc = 0;
    this.numBytes = 0;
    this.outputData = null;
    this.restarting = false;
    this.mask = 0;

    if (typeof numBytes !== "undefined") {
        this.numBytes = numBytes;
    }
};


/*** Static Pseudo-constants ***/

jpeg.lossless.Decoder.IDCT_P = [0, 5, 40, 16, 45, 2, 7, 42, 21, 56, 8, 61, 18, 47, 1, 4, 41, 23, 58, 13, 32, 24, 37, 10, 63, 17, 44, 3, 6, 43, 20,
    57, 15, 34, 29, 48, 53, 26, 39, 9, 60, 19, 46, 22, 59, 12, 33, 31, 50, 55, 25, 36, 11, 62, 14, 35, 28, 49, 52, 27, 38, 30, 51, 54];
jpeg.lossless.Decoder.TABLE = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53,
    10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63];
jpeg.lossless.Decoder.MAX_HUFFMAN_SUBTREE = 50;
jpeg.lossless.Decoder.MSB = 0x80000000;
jpeg.lossless.Decoder.RESTART_MARKER_BEGIN = 0xFFD0;
jpeg.lossless.Decoder.RESTART_MARKER_END = 0xFFD7;

/*** Prototype Methods ***/

jpeg.lossless.Decoder.prototype.decompress = function (buffer, offset, length) {
    return this.decode(buffer, offset, length).buffer;
};



jpeg.lossless.Decoder.prototype.decode = function (buffer, offset, length, numBytes) {
    /*jslint bitwise: true */

    var current, scanNum = 0, pred = [], i, compN, temp = [], index = [], mcuNum;

    if (typeof buffer !== "undefined") {
        this.buffer = buffer;
    }

    if (typeof numBytes !== "undefined") {
        this.numBytes = numBytes;
    }

    this.stream = new jpeg.lossless.DataStream(this.buffer, offset, length);
    this.buffer = null;

    this.xLoc = 0;
    this.yLoc = 0;
    current = this.stream.get16();

    if (current !== 0xFFD8) { // SOI
        throw new Error("Not a JPEG file");
    }

    current = this.stream.get16();

    while ((((current >> 4) !== 0x0FFC) || (current === 0xFFC4))) { // SOF 0~15
        switch (current) {
            case 0xFFC4: // DHT
                this.huffTable.read(this.stream, this.HuffTab);
                break;
            case 0xFFCC: // DAC
                throw new Error("Program doesn't support arithmetic coding. (format throw new IOException)");
            case 0xFFDB:
                this.quantTable.read(this.stream, jpeg.lossless.Decoder.TABLE);
                break;
            case 0xFFDD:
                this.restartInterval = this.readNumber();
                break;
            case 0xFFE0:
            case 0xFFE1:
            case 0xFFE2:
            case 0xFFE3:
            case 0xFFE4:
            case 0xFFE5:
            case 0xFFE6:
            case 0xFFE7:
            case 0xFFE8:
            case 0xFFE9:
            case 0xFFEA:
            case 0xFFEB:
            case 0xFFEC:
            case 0xFFED:
            case 0xFFEE:
            case 0xFFEF:
                this.readApp();
                break;
            case 0xFFFE:
                this.readComment();
                break;
            default:
                if ((current >> 8) !== 0xFF) {
                    throw new Error("ERROR: format throw new IOException! (decode)");
                }
        }

        current = this.stream.get16();
    }

    if ((current < 0xFFC0) || (current > 0xFFC7)) {
        throw new Error("ERROR: could not handle arithmetic code!");
    }

    this.frame.read(this.stream);
    current = this.stream.get16();

    do {
        while (current !== 0x0FFDA) { // SOS
            switch (current) {
                case 0xFFC4: // DHT
                    this.huffTable.read(this.stream, this.HuffTab);
                    break;
                case 0xFFCC: // DAC
                    throw new Error("Program doesn't support arithmetic coding. (format throw new IOException)");
                case 0xFFDB:
                    this.quantTable.read(this.stream, jpeg.lossless.Decoder.TABLE);
                    break;
                case 0xFFDD:
                    this.restartInterval = this.readNumber();
                    break;
                case 0xFFE0:
                case 0xFFE1:
                case 0xFFE2:
                case 0xFFE3:
                case 0xFFE4:
                case 0xFFE5:
                case 0xFFE6:
                case 0xFFE7:
                case 0xFFE8:
                case 0xFFE9:
                case 0xFFEA:
                case 0xFFEB:
                case 0xFFEC:
                case 0xFFED:
                case 0xFFEE:
                case 0xFFEF:
                    this.readApp();
                    break;
                case 0xFFFE:
                    this.readComment();
                    break;
                default:
                    if ((current >> 8) !== 0xFF) {
                        throw new Error("ERROR: format throw new IOException! (Parser.decode)");
                    }
            }

            current = this.stream.get16();
        }

        this.precision = this.frame.precision;
        this.components = this.frame.components;

        if (!this.numBytes) {
            this.numBytes = parseInt(Math.ceil(this.precision / 8));
        }

        if (this.numBytes == 1) {
            this.mask = 0xFF;
        } else {
            this.mask = 0xFFFF;
        }

        this.scan.read(this.stream);
        this.numComp = this.scan.numComp;
        this.selection = this.scan.selection;

        if (this.numBytes === 1) {
            if (this.numComp === 3) {
                this.getter = this.getValueRGB;
                this.setter = this.setValueRGB;
                this.output = this.outputRGB;
            } else {
                this.getter = this.getValue8;
                this.setter = this.setValue8;
                this.output = this.outputSingle;
            }
        } else {
            this.getter = this.getValue16;
            this.setter = this.setValue16;
            this.output = this.outputSingle;
        }

        switch (this.selection) {
            case 2:
                this.selector = this.select2;
                break;
            case 3:
                this.selector = this.select3;
                break;
            case 4:
                this.selector = this.select4;
                break;
            case 5:
                this.selector = this.select5;
                break;
            case 6:
                this.selector = this.select6;
                break;
            case 7:
                this.selector = this.select7;
                break;
            default:
                this.selector = this.select1;
                break;
        }

        this.scanComps = this.scan.components;
        this.quantTables = this.quantTable.quantTables;

        for (i = 0; i < this.numComp; i+=1) {
            compN = this.scanComps[i].scanCompSel;
            this.qTab[i] = this.quantTables[this.components[compN].quantTableSel];
            this.nBlock[i] = this.components[compN].vSamp * this.components[compN].hSamp;
            this.dcTab[i] = this.HuffTab[this.scanComps[i].dcTabSel][0];
            this.acTab[i] = this.HuffTab[this.scanComps[i].acTabSel][1];
        }

        this.xDim = this.frame.dimX;
        this.yDim = this.frame.dimY;
        this.outputData = new DataView(new ArrayBuffer(this.xDim * this.yDim * this.numBytes * this.numComp));

        scanNum+=1;

        while (true) { // Decode one scan
            temp[0] = 0;
            index[0] = 0;

            for (i = 0; i < 10; i+=1) {
                pred[i] = (1 << (this.precision - 1));
            }

            if (this.restartInterval === 0) {
                current = this.decodeUnit(pred, temp, index);

                while ((current === 0) && ((this.xLoc < this.xDim) && (this.yLoc < this.yDim))) {
                    this.output(pred);
                    current = this.decodeUnit(pred, temp, index);
                }

                break; //current=MARKER
            }

            for (mcuNum = 0; mcuNum < this.restartInterval; mcuNum+=1) {
                this.restarting = (mcuNum == 0);
                current = this.decodeUnit(pred, temp, index);
                this.output(pred);

                if (current !== 0) {
                    break;
                }
            }

            if (current === 0) {
                if (this.markerIndex !== 0) {
                    current = (0xFF00 | this.marker);
                    this.markerIndex = 0;
                } else {
                    current = this.stream.get16();
                }
            }

            if (!((current >= jpeg.lossless.Decoder.RESTART_MARKER_BEGIN) &&
                (current <= jpeg.lossless.Decoder.RESTART_MARKER_END))) {
                break; //current=MARKER
            }
        }

        if ((current === 0xFFDC) && (scanNum === 1)) { //DNL
            this.readNumber();
            current = this.stream.get16();
        }
    } while ((current !== 0xFFD9) && ((this.xLoc < this.xDim) && (this.yLoc < this.yDim)) && (scanNum === 0));

    return this.outputData;
};



jpeg.lossless.Decoder.prototype.decodeUnit = function (prev, temp, index) {
    if (this.numComp == 1) {
        return this.decodeSingle(prev, temp, index);
    } else if (this.numComp == 3) {
        return this.decodeRGB(prev, temp, index);
    } else {
        return -1;
    }
};



jpeg.lossless.Decoder.prototype.select1 = function (compOffset) {
    return this.getPreviousX(compOffset);
};



jpeg.lossless.Decoder.prototype.select2 = function (compOffset) {
    return this.getPreviousY(compOffset);
};



jpeg.lossless.Decoder.prototype.select3 = function (compOffset) {
    return this.getPreviousXY(compOffset);
};



jpeg.lossless.Decoder.prototype.select4 = function (compOffset) {
    return (this.getPreviousX(compOffset) + this.getPreviousY(compOffset)) - this.getPreviousXY(compOffset);
};



jpeg.lossless.Decoder.prototype.select5 = function (compOffset) {
    return this.getPreviousX(compOffset) + ((this.getPreviousY(compOffset) - this.getPreviousXY(compOffset)) >> 1);
};



jpeg.lossless.Decoder.prototype.select6 = function (compOffset) {
    return this.getPreviousY(compOffset) + ((this.getPreviousX(compOffset) - this.getPreviousXY(compOffset)) >> 1);
};



jpeg.lossless.Decoder.prototype.select7 = function (compOffset) {
    return ((this.getPreviousX(compOffset) + this.getPreviousY(compOffset)) / 2);
};



jpeg.lossless.Decoder.prototype.decodeRGB = function (prev, temp, index) {
    /*jslint bitwise: true */

    var value, actab, dctab, qtab, ctrC, i, k, j;

    prev[0] = this.selector(0);
    prev[1] = this.selector(1);
    prev[2] = this.selector(2);

    for (ctrC = 0; ctrC < this.numComp; ctrC+=1) {
        qtab = this.qTab[ctrC];
        actab = this.acTab[ctrC];
        dctab = this.dcTab[ctrC];
        for (i = 0; i < this.nBlock[ctrC]; i+=1) {
            for (k = 0; k < this.IDCT_Source.length; k+=1) {
                this.IDCT_Source[k] = 0;
            }

            value = this.getHuffmanValue(dctab, temp, index);

            if (value >= 0xFF00) {
                return value;
            }

            prev[ctrC] = this.IDCT_Source[0] = prev[ctrC] + this.getn(index, value, temp, index);
            this.IDCT_Source[0] *= qtab[0];

            for (j = 1; j < 64; j+=1) {
                value = this.getHuffmanValue(actab, temp, index);

                if (value >= 0xFF00) {
                    return value;
                }

                j += (value >> 4);

                if ((value & 0x0F) === 0) {
                    if ((value >> 4) === 0) {
                        break;
                    }
                } else {
                    this.IDCT_Source[jpeg.lossless.Decoder.IDCT_P[j]] = this.getn(index, value & 0x0F, temp, index) * qtab[j];
                }
            }
        }
    }

    return 0;
};



jpeg.lossless.Decoder.prototype.decodeSingle = function (prev, temp, index) {
    /*jslint bitwise: true */

    var value, i, n, nRestart;

    if (this.restarting) {
        this.restarting = false;
        prev[0] = (1 << (this.frame.precision - 1));
    } else {
        prev[0] = this.selector();
    }

    for (i = 0; i < this.nBlock[0]; i+=1) {
        value = this.getHuffmanValue(this.dcTab[0], temp, index);
        if (value >= 0xFF00) {
            return value;
        }

        n = this.getn(prev, value, temp, index);
        nRestart = (n >> 8);

        if ((nRestart >= jpeg.lossless.Decoder.RESTART_MARKER_BEGIN) && (nRestart <= jpeg.lossless.Decoder.RESTART_MARKER_END)) {
            return nRestart;
        }

        prev[0] += n;
    }

    return 0;
};



//	Huffman table for fast search: (HuffTab) 8-bit Look up table 2-layer search architecture, 1st-layer represent 256 node (8 bits) if codeword-length > 8
//	bits, then the entry of 1st-layer = (# of 2nd-layer table) | MSB and it is stored in the 2nd-layer Size of tables in each layer are 256.
//	HuffTab[*][*][0-256] is always the only 1st-layer table.
//
//	An entry can be: (1) (# of 2nd-layer table) | MSB , for code length > 8 in 1st-layer (2) (Code length) << 8 | HuffVal
//
//	HuffmanValue(table   HuffTab[x][y] (ex) HuffmanValue(HuffTab[1][0],...)
//	                ):
//	    return: Huffman Value of table
//	            0xFF?? if it receives a MARKER
//	    Parameter:  table   HuffTab[x][y] (ex) HuffmanValue(HuffTab[1][0],...)
//	                temp    temp storage for remainded bits
//	                index   index to bit of temp
//	                in      FILE pointer
//	    Effect:
//	        temp  store new remainded bits
//	        index change to new index
//	        in    change to new position
//	    NOTE:
//	      Initial by   temp=0; index=0;
//	    NOTE: (explain temp and index)
//	      temp: is always in the form at calling time or returning time
//	       |  byte 4  |  byte 3  |  byte 2  |  byte 1  |
//	       |     0    |     0    | 00000000 | 00000??? |  if not a MARKER
//	                                               ^index=3 (from 0 to 15)
//	                                               321
//	    NOTE (marker and marker_index):
//	      If get a MARKER from 'in', marker=the low-byte of the MARKER
//	        and marker_index=9
//	      If marker_index=9 then index is always > 8, or HuffmanValue()
//	        will not be called
jpeg.lossless.Decoder.prototype.getHuffmanValue = function (table, temp, index) {
    /*jslint bitwise: true */

    var code, input, mask;
    mask = 0xFFFF;

    if (index[0] < 8) {
        temp[0] <<= 8;
        input = this.stream.get8();
        if (input === 0xFF) {
            this.marker = this.stream.get8();
            if (this.marker !== 0) {
                this.markerIndex = 9;
            }
        }
        temp[0] |= input;
    } else {
        index[0] -= 8;
    }

    code = table[temp[0] >> index[0]];

    if ((code & jpeg.lossless.Decoder.MSB) !== 0) {
        if (this.markerIndex !== 0) {
            this.markerIndex = 0;
            return 0xFF00 | this.marker;
        }

        temp[0] &= (mask >> (16 - index[0]));
        temp[0] <<= 8;
        input = this.stream.get8();

        if (input === 0xFF) {
            this.marker = this.stream.get8();
            if (this.marker !== 0) {
                this.markerIndex = 9;
            }
        }

        temp[0] |= input;
        code = table[((code & 0xFF) * 256) + (temp[0] >> index[0])];
        index[0] += 8;
    }

    index[0] += 8 - (code >> 8);

    if (index[0] < 0) {
        throw new Error("index=" + index[0] + " temp=" + temp[0] + " code=" + code + " in HuffmanValue()");
    }

    if (index[0] < this.markerIndex) {
        this.markerIndex = 0;
        return 0xFF00 | this.marker;
    }

    temp[0] &= (mask >> (16 - index[0]));
    return code & 0xFF;
};



jpeg.lossless.Decoder.prototype.getn = function (PRED, n, temp, index) {
    /*jslint bitwise: true */

    var result, one, n_one, mask, input;
    one = 1;
    n_one = -1;
    mask = 0xFFFF;

    if (n === 0) {
        return 0;
    }

    if (n === 16) {
        if (PRED[0] >= 0) {
            return -32768;
        } else {
            return 32768;
        }
    }

    index[0] -= n;

    if (index[0] >= 0) {
        if ((index[0] < this.markerIndex) && !this.isLastPixel()) { // this was corrupting the last pixel in some cases
            this.markerIndex = 0;
            return (0xFF00 | this.marker) << 8;
        }

        result = temp[0] >> index[0];
        temp[0] &= (mask >> (16 - index[0]));
    } else {
        temp[0] <<= 8;
        input = this.stream.get8();

        if (input === 0xFF) {
            this.marker = this.stream.get8();
            if (this.marker !== 0) {
                this.markerIndex = 9;
            }
        }

        temp[0] |= input;
        index[0] += 8;

        if (index[0] < 0) {
            if (this.markerIndex !== 0) {
                this.markerIndex = 0;
                return (0xFF00 | this.marker) << 8;
            }

            temp[0] <<= 8;
            input = this.stream.get8();

            if (input === 0xFF) {
                this.marker = this.stream.get8();
                if (this.marker !== 0) {
                    this.markerIndex = 9;
                }
            }

            temp[0] |= input;
            index[0] += 8;
        }

        if (index[0] < 0) {
            throw new Error("index=" + index[0] + " in getn()");
        }

        if (index[0] < this.markerIndex) {
            this.markerIndex = 0;
            return (0xFF00 | this.marker) << 8;
        }

        result = temp[0] >> index[0];
        temp[0] &= (mask >> (16 - index[0]));
    }

    if (result < (one << (n - 1))) {
        result += (n_one << n) + 1;
    }

    return result;
};



jpeg.lossless.Decoder.prototype.getPreviousX = function (compOffset) {
    /*jslint bitwise: true */

    if (this.xLoc > 0) {
        return this.getter((((this.yLoc * this.xDim) + this.xLoc) - 1), compOffset);
    } else if (this.yLoc > 0) {
        return this.getPreviousY(compOffset);
    } else {
        return (1 << (this.frame.precision - 1));
    }
};



jpeg.lossless.Decoder.prototype.getPreviousXY = function (compOffset) {
    /*jslint bitwise: true */

    if ((this.xLoc > 0) && (this.yLoc > 0)) {
        return this.getter(((((this.yLoc - 1) * this.xDim) + this.xLoc) - 1), compOffset);
    } else {
        return this.getPreviousY(compOffset);
    }
};



jpeg.lossless.Decoder.prototype.getPreviousY = function (compOffset) {
    /*jslint bitwise: true */

    if (this.yLoc > 0) {
        return this.getter((((this.yLoc - 1) * this.xDim) + this.xLoc), compOffset);
    } else {
        return this.getPreviousX(compOffset);
    }
};



jpeg.lossless.Decoder.prototype.isLastPixel = function () {
    return (this.xLoc === (this.xDim - 1)) && (this.yLoc === (this.yDim - 1));
};



jpeg.lossless.Decoder.prototype.outputSingle = function (PRED) {
    if ((this.xLoc < this.xDim) && (this.yLoc < this.yDim)) {
        this.setter((((this.yLoc * this.xDim) + this.xLoc)), this.mask & PRED[0]);

        this.xLoc+=1;

        if (this.xLoc >= this.xDim) {
            this.yLoc+=1;
            this.xLoc = 0;
        }
    }
};



jpeg.lossless.Decoder.prototype.outputRGB = function (PRED) {
    var offset = ((this.yLoc * this.xDim) + this.xLoc);

    if ((this.xLoc < this.xDim) && (this.yLoc < this.yDim)) {
        this.setter(offset, PRED[0], 0);
        this.setter(offset, PRED[1], 1);
        this.setter(offset, PRED[2], 2);

        this.xLoc+=1;

        if (this.xLoc >= this.xDim) {
            this.yLoc+=1;
            this.xLoc = 0;
        }
    }
};



jpeg.lossless.Decoder.prototype.setValue16 = function (index, val) {
    this.outputData.setInt16(index * 2, val, true);
};



jpeg.lossless.Decoder.prototype.getValue16 = function (index) {
    return this.outputData.getInt16(index * 2, true);
};



jpeg.lossless.Decoder.prototype.setValue8 = function (index, val) {
    this.outputData.setInt8(index, val);
};



jpeg.lossless.Decoder.prototype.getValue8 = function (index) {
    return this.outputData.getInt8(index);
};



jpeg.lossless.Decoder.prototype.setValueRGB = function (index, val, compOffset) {
    this.outputData.setUint8(index * 3 + compOffset, val);
};



jpeg.lossless.Decoder.prototype.getValueRGB = function (index, compOffset) {
    return this.outputData.getUint8(index * 3 + compOffset);
};



jpeg.lossless.Decoder.prototype.readApp = function() {
    var count = 0, length = this.stream.get16();
    count += 2;

    while (count < length) {
        this.stream.get8();
        count+=1;
    }

    return length;
};



jpeg.lossless.Decoder.prototype.readComment = function () {
    var sb = "", count = 0, length;

    length = this.stream.get16();
    count += 2;

    while (count < length) {
        sb += this.stream.get8();
        count+=1;
    }

    return sb;
};



jpeg.lossless.Decoder.prototype.readNumber = function() {
    var Ld = this.stream.get16();

    if (Ld !== 4) {
        throw new Error("ERROR: Define number format throw new IOException [Ld!=4]");
    }

    return this.stream.get16();
};



/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = jpeg.lossless.Decoder;
}

},{"./data-stream.js":3,"./frame-header.js":5,"./huffman-table.js":6,"./quantization-table.js":8,"./scan-header.js":10,"./utils.js":11}],5:[function(require,module,exports){
/*
 * Copyright (C) 2015 Michael Martinez
 * Changes: Added support for selection values 2-7, fixed minor bugs &
 * warnings, split into multiple class files, and general clean up.
 *
 * 08-25-2015: Helmut Dersch agreed to a license change from LGPL to MIT.
 */

/*
 * Copyright (C) Helmut Dersch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/
var jpeg = jpeg || {};
jpeg.lossless = jpeg.lossless || {};
jpeg.lossless.ComponentSpec = jpeg.lossless.ComponentSpec || ((typeof require !== 'undefined') ? require('./component-spec.js') : null);
jpeg.lossless.DataStream = jpeg.lossless.DataStream || ((typeof require !== 'undefined') ? require('./data-stream.js') : null);


/*** Constructor ***/
jpeg.lossless.FrameHeader = jpeg.lossless.FrameHeader || function () {
    this.components = []; // Components
    this.dimX = 0; // Number of samples per line
    this.dimY = 0; // Number of lines
    this.numComp = 0; // Number of component in the frame
    this.precision = 0; // Sample Precision (from the original image)
};



/*** Prototype Methods ***/

jpeg.lossless.FrameHeader.prototype.read = function (data) {
    /*jslint bitwise: true */

    var count = 0, length, i, c, temp;

    length = data.get16();
    count += 2;

    this.precision = data.get8();
    count+=1;

    this.dimY = data.get16();
    count += 2;

    this.dimX = data.get16();
    count += 2;

    this.numComp = data.get8();
    count+=1;
    for (i = 1; i <= this.numComp; i+=1) {
        if (count > length) {
            throw new Error("ERROR: frame format error");
        }

        c = data.get8();
        count+=1;

        if (count >= length) {
            throw new Error("ERROR: frame format error [c>=Lf]");
        }

        temp = data.get8();
        count+=1;

        if (!this.components[c]) {
            this.components[c] = new jpeg.lossless.ComponentSpec();
        }

        this.components[c].hSamp = temp >> 4;
        this.components[c].vSamp = temp & 0x0F;
        this.components[c].quantTableSel = data.get8();
        count+=1;
    }

    if (count !== length) {
        throw new Error("ERROR: frame format error [Lf!=count]");
    }

    return 1;
};


/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = jpeg.lossless.FrameHeader;
}

},{"./component-spec.js":2,"./data-stream.js":3}],6:[function(require,module,exports){
/*
 * Copyright (C) 2015 Michael Martinez
 * Changes: Added support for selection values 2-7, fixed minor bugs &
 * warnings, split into multiple class files, and general clean up.
 *
 * 08-25-2015: Helmut Dersch agreed to a license change from LGPL to MIT.
 */

/*
 * Copyright (C) Helmut Dersch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/
var jpeg = jpeg || {};
jpeg.lossless = jpeg.lossless || {};
jpeg.lossless.DataStream = jpeg.lossless.DataStream || ((typeof require !== 'undefined') ? require('./data-stream.js') : null);
jpeg.lossless.Utils = jpeg.lossless.Utils || ((typeof require !== 'undefined') ? require('./utils.js') : null);


/*** Constructor ***/
jpeg.lossless.HuffmanTable = jpeg.lossless.HuffmanTable || function () {
    this.l = jpeg.lossless.Utils.createArray(4, 2, 16);
    this.th = [];
    this.v = jpeg.lossless.Utils.createArray(4, 2, 16, 200);
    this.tc = jpeg.lossless.Utils.createArray(4, 2);

    this.tc[0][0] = 0;
    this.tc[1][0] = 0;
    this.tc[2][0] = 0;
    this.tc[3][0] = 0;
    this.tc[0][1] = 0;
    this.tc[1][1] = 0;
    this.tc[2][1] = 0;
    this.tc[3][1] = 0;
    this.th[0] = 0;
    this.th[1] = 0;
    this.th[2] = 0;
    this.th[3] = 0;
};



/*** Static Pseudo-constants ***/

jpeg.lossless.HuffmanTable.MSB = 0x80000000;


/*** Prototype Methods ***/

jpeg.lossless.HuffmanTable.prototype.read = function(data, HuffTab) {
    /*jslint bitwise: true */

    var count = 0, length, temp, t, c, i, j;

    length = data.get16();
    count += 2;

    while (count < length) {
        temp = data.get8();
        count+=1;
        t = temp & 0x0F;
        if (t > 3) {
            throw new Error("ERROR: Huffman table ID > 3");
        }

        c = temp >> 4;
        if (c > 2) {
            throw new Error("ERROR: Huffman table [Table class > 2 ]");
        }

        this.th[t] = 1;
        this.tc[t][c] = 1;

        for (i = 0; i < 16; i+=1) {
            this.l[t][c][i] = data.get8();
            count+=1;
        }

        for (i = 0; i < 16; i+=1) {
            for (j = 0; j < this.l[t][c][i]; j+=1) {
                if (count > length) {
                    throw new Error("ERROR: Huffman table format error [count>Lh]");
                }

                this.v[t][c][i][j] = data.get8();
                count+=1;
            }
        }
    }

    if (count !== length) {
        throw new Error("ERROR: Huffman table format error [count!=Lf]");
    }

    for (i = 0; i < 4; i+=1) {
        for (j = 0; j < 2; j+=1) {
            if (this.tc[i][j] !== 0) {
                this.buildHuffTable(HuffTab[i][j], this.l[i][j], this.v[i][j]);
            }
        }
    }

    return 1;
};



//	Build_HuffTab()
//	Parameter:  t       table ID
//	            c       table class ( 0 for DC, 1 for AC )
//	            L[i]    # of codewords which length is i
//	            V[i][j] Huffman Value (length=i)
//	Effect:
//	    build up HuffTab[t][c] using L and V.
jpeg.lossless.HuffmanTable.prototype.buildHuffTable = function(tab, L, V) {
    /*jslint bitwise: true */

    var currentTable, temp, k, i, j, n;
    temp = 256;
    k = 0;

    for (i = 0; i < 8; i+=1) { // i+1 is Code length
        for (j = 0; j < L[i]; j+=1) {
            for (n = 0; n < (temp >> (i + 1)); n+=1) {
                tab[k] = V[i][j] | ((i + 1) << 8);
                k+=1;
            }
        }
    }

    for (i = 1; k < 256; i+=1, k+=1) {
        tab[k] = i | jpeg.lossless.HuffmanTable.MSB;
    }

    currentTable = 1;
    k = 0;

    for (i = 8; i < 16; i+=1) { // i+1 is Code length
        for (j = 0; j < L[i]; j+=1) {
            for (n = 0; n < (temp >> (i - 7)); n+=1) {
                tab[(currentTable * 256) + k] = V[i][j] | ((i + 1) << 8);
                k+=1;
            }

            if (k >= 256) {
                if (k > 256) {
                    throw new Error("ERROR: Huffman table error(1)!");
                }

                k = 0;
                currentTable+=1;
            }
        }
    }
};


/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = jpeg.lossless.HuffmanTable;
}

},{"./data-stream.js":3,"./utils.js":11}],7:[function(require,module,exports){
/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/
var jpeg = jpeg || {};
jpeg.lossless = jpeg.lossless || {};
jpeg.lossless.ComponentSpec = jpeg.lossless.ComponentSpec || ((typeof require !== 'undefined') ? require('./component-spec.js') : null);
jpeg.lossless.DataStream = jpeg.lossless.DataStream || ((typeof require !== 'undefined') ? require('./data-stream.js') : null);
jpeg.lossless.Decoder = jpeg.lossless.Decoder || ((typeof require !== 'undefined') ? require('./decoder.js') : null);
jpeg.lossless.FrameHeader = jpeg.lossless.FrameHeader || ((typeof require !== 'undefined') ? require('./frame-header.js') : null);
jpeg.lossless.HuffmanTable = jpeg.lossless.HuffmanTable || ((typeof require !== 'undefined') ? require('./huffman-table.js') : null);
jpeg.lossless.QuantizationTable = jpeg.lossless.QuantizationTable || ((typeof require !== 'undefined') ? require('./quantization-table.js') : null);
jpeg.lossless.ScanComponent = jpeg.lossless.ScanComponent || ((typeof require !== 'undefined') ? require('./scan-component.js') : null);
jpeg.lossless.ScanHeader = jpeg.lossless.ScanHeader || ((typeof require !== 'undefined') ? require('./scan-header.js') : null);
jpeg.lossless.Utils = jpeg.lossless.Utils || ((typeof require !== 'undefined') ? require('./utils.js') : null);


/*** Exports ***/
var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = jpeg;
}

},{"./component-spec.js":2,"./data-stream.js":3,"./decoder.js":4,"./frame-header.js":5,"./huffman-table.js":6,"./quantization-table.js":8,"./scan-component.js":9,"./scan-header.js":10,"./utils.js":11}],8:[function(require,module,exports){
/*
 * Copyright (C) 2015 Michael Martinez
 * Changes: Added support for selection values 2-7, fixed minor bugs &
 * warnings, split into multiple class files, and general clean up.
 *
 * 08-25-2015: Helmut Dersch agreed to a license change from LGPL to MIT.
 */

/*
 * Copyright (C) Helmut Dersch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/
var jpeg = jpeg || {};
jpeg.lossless = jpeg.lossless || {};
jpeg.lossless.DataStream = jpeg.lossless.DataStream || ((typeof require !== 'undefined') ? require('./data-stream.js') : null);
jpeg.lossless.Utils = jpeg.lossless.Utils || ((typeof require !== 'undefined') ? require('./utils.js') : null);


/*** Constructor ***/
jpeg.lossless.QuantizationTable = jpeg.lossless.QuantizationTable || function () {
    this.precision = []; // Quantization precision 8 or 16
    this.tq = []; // 1: this table is presented
    this.quantTables = jpeg.lossless.Utils.createArray(4, 64); // Tables

    this.tq[0] = 0;
    this.tq[1] = 0;
    this.tq[2] = 0;
    this.tq[3] = 0;
};



/*** Static Methods ***/

jpeg.lossless.QuantizationTable.enhanceQuantizationTable = function(qtab, table) {
    /*jslint bitwise: true */

    var i;

    for (i = 0; i < 8; i+=1) {
        qtab[table[(0 * 8) + i]] *= 90;
        qtab[table[(4 * 8) + i]] *= 90;
        qtab[table[(2 * 8) + i]] *= 118;
        qtab[table[(6 * 8) + i]] *= 49;
        qtab[table[(5 * 8) + i]] *= 71;
        qtab[table[(1 * 8) + i]] *= 126;
        qtab[table[(7 * 8) + i]] *= 25;
        qtab[table[(3 * 8) + i]] *= 106;
    }

    for (i = 0; i < 8; i+=1) {
        qtab[table[0 + (8 * i)]] *= 90;
        qtab[table[4 + (8 * i)]] *= 90;
        qtab[table[2 + (8 * i)]] *= 118;
        qtab[table[6 + (8 * i)]] *= 49;
        qtab[table[5 + (8 * i)]] *= 71;
        qtab[table[1 + (8 * i)]] *= 126;
        qtab[table[7 + (8 * i)]] *= 25;
        qtab[table[3 + (8 * i)]] *= 106;
    }

    for (i = 0; i < 64; i+=1) {
        qtab[i] >>= 6;
    }
};


/*** Prototype Methods ***/

jpeg.lossless.QuantizationTable.prototype.read = function (data, table) {
    /*jslint bitwise: true */

    var count = 0, length, temp, t, i;

    length = data.get16();
    count += 2;

    while (count < length) {
        temp = data.get8();
        count+=1;
        t = temp & 0x0F;

        if (t > 3) {
            throw new Error("ERROR: Quantization table ID > 3");
        }

        this.precision[t] = temp >> 4;

        if (this.precision[t] === 0) {
            this.precision[t] = 8;
        } else if (this.precision[t] === 1) {
            this.precision[t] = 16;
        } else {
            throw new Error("ERROR: Quantization table precision error");
        }

        this.tq[t] = 1;

        if (this.precision[t] === 8) {
            for (i = 0; i < 64; i+=1) {
                if (count > length) {
                    throw new Error("ERROR: Quantization table format error");
                }

                this.quantTables[t][i] = data.get8();
                count+=1;
            }

            jpeg.lossless.QuantizationTable.enhanceQuantizationTable(this.quantTables[t], table);
        } else {
            for (i = 0; i < 64; i+=1) {
                if (count > length) {
                    throw new Error("ERROR: Quantization table format error");
                }

                this.quantTables[t][i] = data.get16();
                count += 2;
            }

            jpeg.lossless.QuantizationTable.enhanceQuantizationTable(this.quantTables[t], table);
        }
    }

    if (count !== length) {
        throw new Error("ERROR: Quantization table error [count!=Lq]");
    }

    return 1;
};



/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = jpeg.lossless.QuantizationTable;
}

},{"./data-stream.js":3,"./utils.js":11}],9:[function(require,module,exports){
/*
 * Copyright (C) 2015 Michael Martinez
 * Changes: Added support for selection values 2-7, fixed minor bugs &
 * warnings, split into multiple class files, and general clean up.
 *
 * 08-25-2015: Helmut Dersch agreed to a license change from LGPL to MIT.
 */

/*
 * Copyright (C) Helmut Dersch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/
var jpeg = jpeg || {};
jpeg.lossless = jpeg.lossless || {};


/*** Constructor ***/
jpeg.lossless.ScanComponent = jpeg.lossless.ScanComponent || function () {
    this.acTabSel = 0; // AC table selector
    this.dcTabSel = 0; // DC table selector
    this.scanCompSel = 0; // Scan component selector
};



/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = jpeg.lossless.ScanComponent;
}

},{}],10:[function(require,module,exports){
/*
 * Copyright (C) 2015 Michael Martinez
 * Changes: Added support for selection values 2-7, fixed minor bugs &
 * warnings, split into multiple class files, and general clean up.
 *
 * 08-25-2015: Helmut Dersch agreed to a license change from LGPL to MIT.
 */

/*
 * Copyright (C) Helmut Dersch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/
var jpeg = jpeg || {};
jpeg.lossless = jpeg.lossless || {};
jpeg.lossless.DataStream = jpeg.lossless.DataStream || ((typeof require !== 'undefined') ? require('./data-stream.js') : null);
jpeg.lossless.ScanComponent = jpeg.lossless.ScanComponent || ((typeof require !== 'undefined') ? require('./scan-component.js') : null);


/*** Constructor ***/
jpeg.lossless.ScanHeader = jpeg.lossless.ScanHeader || function () {
    this.ah = 0;
    this.al = 0;
    this.numComp = 0; // Number of components in the scan
    this.selection = 0; // Start of spectral or predictor selection
    this.spectralEnd = 0; // End of spectral selection
    this.components = [];
};


/*** Prototype Methods ***/

jpeg.lossless.ScanHeader.prototype.read = function(data) {
    /*jslint bitwise: true */

    var count = 0, length, i, temp;

    length = data.get16();
    count += 2;

    this.numComp = data.get8();
    count+=1;

    for (i = 0; i < this.numComp; i+=1) {
        this.components[i] = new jpeg.lossless.ScanComponent();

        if (count > length) {
            throw new Error("ERROR: scan header format error");
        }

        this.components[i].scanCompSel = data.get8();
        count+=1;

        temp = data.get8();
        count+=1;

        this.components[i].dcTabSel = (temp >> 4);
        this.components[i].acTabSel = (temp & 0x0F);
    }

    this.selection = data.get8();
    count+=1;

    this.spectralEnd = data.get8();
    count+=1;

    temp = data.get8();
    this.ah = (temp >> 4);
    this.al = (temp & 0x0F);
    count+=1;

    if (count !== length) {
        throw new Error("ERROR: scan header format error [count!=Ns]");
    }

    return 1;
};



/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = jpeg.lossless.ScanHeader;
}

},{"./data-stream.js":3,"./scan-component.js":9}],11:[function(require,module,exports){
/*
 * Copyright (C) 2015 Michael Martinez
 * Changes: Added support for selection values 2-7, fixed minor bugs &
 * warnings, split into multiple class files, and general clean up.
 *
 * 08-25-2015: Helmut Dersch agreed to a license change from LGPL to MIT.
 */

/*
 * Copyright (C) Helmut Dersch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/
var jpeg = jpeg || {};
jpeg.lossless = jpeg.lossless || {};


/*** Constructor ***/
jpeg.lossless.Utils = jpeg.lossless.Utils || {};


/*** Static methods ***/

// http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
jpeg.lossless.Utils.createArray = function (length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = jpeg.lossless.Utils.createArray.apply(this, args);
    }

    return arr;
};


// http://stackoverflow.com/questions/18638900/javascript-crc32
jpeg.lossless.Utils.makeCRCTable = function(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
};

jpeg.lossless.Utils.crc32 = function(dataView) {
    var crcTable = jpeg.lossless.Utils.crcTable || (jpeg.lossless.Utils.crcTable = jpeg.lossless.Utils.makeCRCTable());
    var crc = 0 ^ (-1);

    for (var i = 0; i < dataView.byteLength; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ dataView.getUint8(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};


/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = jpeg.lossless.Utils;
}

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cameras = require('./cameras.orthographic');

var _cameras2 = _interopRequireDefault(_cameras);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Orthographic: _cameras2.default
};

},{"./cameras.orthographic":13}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CamerasOrthographic = function (_THREE$OrthographicCa) {
  _inherits(CamerasOrthographic, _THREE$OrthographicCa);

  function CamerasOrthographic(left, right, top, bottom, near, far) {
    _classCallCheck(this, CamerasOrthographic);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CamerasOrthographic).call(this, left, right, top, bottom, near, far));

    _this._upH = null;
    _this._startH = null;
    _this._stopH = null;
    _this._xCosine = null;
    _this._yCosine = null;
    _this._controls = null;
    return _this;
  }

  _createClass(CamerasOrthographic, [{
    key: 'invertRows',
    value: function invertRows() {
      var delta = 0.0001;

      this._upH = this._upH.clone().multiplyScalar(-1);
      this.up.set(this._upH.x, this._upH.y, this._upH.z);

      if (this.position.distanceTo(this._stopH) < delta) {
        this.position.set(this._startH.x, this._startH.y, this._startH.z);
        this.lookAt(this._stopH.x, this._stopH.y, this._stopH.z);

        this._controls.target.set(this._stopH.x, this._stopH.y, this._stopH.z);
      } else {
        this.position.set(this._stopH.x, this._stopH.y, this._stopH.z);
        this.lookAt(this._startH.x, this._startH.y, this._startH.z);

        this._controls.target.set(this._startH.x, this._startH.y, this._startH.z);
      }

      // update related matrices
      this._update();
    }
  }, {
    key: 'invertColumns',
    value: function invertColumns() {
      var delta = 0.0001;

      if (this.position.distanceTo(this._stopH) < delta) {
        this.position.set(this._startH.x, this._startH.y, this._startH.z);
        this.lookAt(this._stopH.x, this._stopH.y, this._stopH.z);

        this._controls.target.set(this._stopH.x, this._stopH.y, this._stopH.z);
      } else {
        this.position.set(this._stopH.x, this._stopH.y, this._stopH.z);
        this.lookAt(this._startH.x, this._startH.y, this._startH.z);

        this._controls.target.set(this._startH.x, this._startH.y, this._startH.z);
      }

      // update related matrices
      this._update();
    }
  }, {
    key: 'rotate',
    value: function rotate() {
      var delta = 0.0001;

      if (this._upH.distanceTo(this._yCosine) < delta && this.position.distanceTo(this._stopH) < delta) {
        this._upH = this._xCosine.clone().multiplyScalar(-1);
      } else if (this._upH.distanceTo(this._xCosine.clone().multiplyScalar(-1)) < delta && this.position.distanceTo(this._stopH) < delta) {
        this._upH = this._yCosine.clone().multiplyScalar(-1);
      } else if (this._upH.distanceTo(this._yCosine.clone().multiplyScalar(-1)) < delta && this.position.distanceTo(this._stopH) < delta) {
        this._upH = this._xCosine.clone();
      } else if (this._upH.distanceTo(this._xCosine) < delta && this.position.distanceTo(this._stopH) < delta) {
        this._upH = this._yCosine.clone();
      } else if (this._upH.distanceTo(this._yCosine) < delta && this.position.distanceTo(this._startH) < delta) {
        this._upH = this._xCosine.clone();
      } else if (this._upH.distanceTo(this._xCosine.clone().multiplyScalar(-1)) < delta && this.position.distanceTo(this._startH) < delta) {
        this._upH = this._yCosine.clone();
      } else if (this._upH.distanceTo(this._yCosine.clone().multiplyScalar(-1)) < delta && this.position.distanceTo(this._startH) < delta) {
        this._upH = this._xCosine.clone().multiplyScalar(-1);
      } else if (this._upH.distanceTo(this._xCosine) < delta && this.position.distanceTo(this._startH) < delta) {
        this._upH = this._yCosine.clone().multiplyScalar(-1);
      } else {
        window.console.log('no match....');
      }

      // update camera
      this.up.set(this._upH.x, this._upH.y, this._upH.z);

      // update related matrices
      this._update();
    }
  }, {
    key: '_update',
    value: function _update() {
      this._controls.update();
      // THEN camera
      this.updateProjectionMatrix();
      this.updateMatrixWorld();
    }
  }, {
    key: 'upH',
    set: function set(upH) {
      this._upH = upH;
    },
    get: function get() {
      return this._upH;
    }
  }, {
    key: 'startH',
    set: function set(startH) {
      this._startH = startH;
    },
    get: function get() {
      return this._startH;
    }
  }, {
    key: 'stopH',
    set: function set(stopH) {
      this._stopH = stopH;
    },
    get: function get() {
      return this._stopH;
    }
  }, {
    key: 'xCosine',
    set: function set(xCosine) {
      this._xCosine = xCosine;
    },
    get: function get() {
      return this._xCosine;
    }
  }, {
    key: 'yCosine',
    set: function set(yCosine) {
      this._yCosine = yCosine;
    },
    get: function get() {
      return this._yCosine;
    }
  }, {
    key: 'controls',
    set: function set(controls) {
      this._controls = controls;
    },
    get: function get() {
      return this._controls;
    }
  }]);

  return CamerasOrthographic;
}(THREE.OrthographicCamera);

exports.default = CamerasOrthographic;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controls = require('./controls.trackball');

var _controls2 = _interopRequireDefault(_controls);

var _controls3 = require('./controls.trackballortho');

var _controls4 = _interopRequireDefault(_controls3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Trackball: _controls2.default,
  TrackballOrtho: _controls4.default
};

},{"./controls.trackball":15,"./controls.trackballortho":16}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Original authors from THREEJS repo
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin  / http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga  / http://lantiga.github.io
 */

var Trackball = function (_THREE$EventDispatche) {
  _inherits(Trackball, _THREE$EventDispatche);

  function Trackball(object, domElement) {
    _classCallCheck(this, Trackball);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Trackball).call(this));

    var _this = _this2;
    var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5, CUSTOM: 99 };

    _this2.object = object;
    _this2.domElement = domElement !== undefined ? domElement : document;

    // API

    _this2.enabled = true;

    _this2.screen = { left: 0, top: 0, width: 0, height: 0 };

    _this2.rotateSpeed = 1.0;
    _this2.zoomSpeed = 1.2;
    _this2.panSpeed = 0.3;

    _this2.noRotate = false;
    _this2.noZoom = false;
    _this2.noPan = false;
    _this2.noCustom = false;

    _this2.forceState = -1;

    _this2.staticMoving = false;
    _this2.dynamicDampingFactor = 0.2;

    _this2.minDistance = 0;
    _this2.maxDistance = Infinity;

    _this2.keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];

    // internals

    _this2.target = new THREE.Vector3();

    var EPS = 0.000001;

    var lastPosition = new THREE.Vector3();

    var _state = STATE.NONE,
        _prevState = STATE.NONE,
        _eye = new THREE.Vector3(),
        _movePrev = new THREE.Vector2(),
        _moveCurr = new THREE.Vector2(),
        _lastAxis = new THREE.Vector3(),
        _lastAngle = 0,
        _zoomStart = new THREE.Vector2(),
        _zoomEnd = new THREE.Vector2(),
        _touchZoomDistanceStart = 0,
        _touchZoomDistanceEnd = 0,
        _panStart = new THREE.Vector2(),
        _panEnd = new THREE.Vector2(),
        _customStart = new THREE.Vector2(),
        _customEnd = new THREE.Vector2();

    // for reset

    _this2.target0 = _this2.target.clone();
    _this2.position0 = _this2.object.position.clone();
    _this2.up0 = _this2.object.up.clone();

    // events

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start' };
    var endEvent = { type: 'end' };

    // methods

    _this2.handleResize = function () {

      if (this.domElement === document) {

        this.screen.left = 0;
        this.screen.top = 0;
        this.screen.width = window.innerWidth;
        this.screen.height = window.innerHeight;
      } else {

        var box = this.domElement.getBoundingClientRect();
        // adjustments come from similar code in the jquery offset() function
        var d = this.domElement.ownerDocument.documentElement;
        this.screen.left = box.left + window.pageXOffset - d.clientLeft;
        this.screen.top = box.top + window.pageYOffset - d.clientTop;
        this.screen.width = box.width;
        this.screen.height = box.height;
      }
    };

    _this2.handleEvent = function (event) {

      if (typeof this[event.type] == 'function') {

        this[event.type](event);
      }
    };

    var getMouseOnScreen = function () {

      var vector = new THREE.Vector2();

      return function (pageX, pageY) {

        vector.set((pageX - _this.screen.left) / _this.screen.width, (pageY - _this.screen.top) / _this.screen.height);

        return vector;
      };
    }();

    var getMouseOnCircle = function () {

      var vector = new THREE.Vector2();

      return function (pageX, pageY) {

        vector.set((pageX - _this.screen.width * 0.5 - _this.screen.left) / (_this.screen.width * 0.5), (_this.screen.height + 2 * (_this.screen.top - pageY)) / _this.screen.width);

        // screen.width intentional
        return vector;
      };
    }();

    _this2.rotateCamera = function () {

      var axis = new THREE.Vector3(),
          quaternion = new THREE.Quaternion(),
          eyeDirection = new THREE.Vector3(),
          objectUpDirection = new THREE.Vector3(),
          objectSidewaysDirection = new THREE.Vector3(),
          moveDirection = new THREE.Vector3(),
          angle;

      return function () {

        moveDirection.set(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0);
        angle = moveDirection.length();

        if (angle) {

          _eye.copy(_this.object.position).sub(_this.target);

          eyeDirection.copy(_eye).normalize();
          objectUpDirection.copy(_this.object.up).normalize();
          objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize();

          objectUpDirection.setLength(_moveCurr.y - _movePrev.y);
          objectSidewaysDirection.setLength(_moveCurr.x - _movePrev.x);

          moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));

          axis.crossVectors(moveDirection, _eye).normalize();

          angle *= _this.rotateSpeed;
          quaternion.setFromAxisAngle(axis, angle);

          _eye.applyQuaternion(quaternion);
          _this.object.up.applyQuaternion(quaternion);

          _lastAxis.copy(axis);
          _lastAngle = angle;
        } else if (!_this.staticMoving && _lastAngle) {

          _lastAngle *= Math.sqrt(1.0 - _this.dynamicDampingFactor);
          _eye.copy(_this.object.position).sub(_this.target);
          quaternion.setFromAxisAngle(_lastAxis, _lastAngle);
          _eye.applyQuaternion(quaternion);
          _this.object.up.applyQuaternion(quaternion);
        }

        _movePrev.copy(_moveCurr);
      };
    }();

    _this2.zoomCamera = function () {

      var factor;

      if (_state === STATE.TOUCH_ZOOM) {

        factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
        _touchZoomDistanceStart = _touchZoomDistanceEnd;
        _eye.multiplyScalar(factor);
      } else {

        factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;

        if (factor !== 1.0 && factor > 0.0) {

          _eye.multiplyScalar(factor);

          if (_this.staticMoving) {

            _zoomStart.copy(_zoomEnd);
          } else {

            _zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;
          }
        }
      }
    };

    _this2.panCamera = function () {

      var mouseChange = new THREE.Vector2(),
          objectUp = new THREE.Vector3(),
          pan = new THREE.Vector3();

      return function () {

        mouseChange.copy(_panEnd).sub(_panStart);

        if (mouseChange.lengthSq()) {

          mouseChange.multiplyScalar(_eye.length() * _this.panSpeed);

          pan.copy(_eye).cross(_this.object.up).setLength(mouseChange.x);
          pan.add(objectUp.copy(_this.object.up).setLength(mouseChange.y));

          _this.object.position.add(pan);
          _this.target.add(pan);

          if (_this.staticMoving) {

            _panStart.copy(_panEnd);
          } else {

            _panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this.dynamicDampingFactor));
          }
        }
      };
    }();

    _this2.checkDistances = function () {

      if (!_this.noZoom || !_this.noPan) {

        if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {

          _this.object.position.addVectors(_this.target, _eye.setLength(_this.maxDistance));
        }

        if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {

          _this.object.position.addVectors(_this.target, _eye.setLength(_this.minDistance));
        }
      }
    };

    _this2.update = function () {

      _eye.subVectors(_this.object.position, _this.target);

      if (!_this.noRotate) {

        _this.rotateCamera();
      }

      if (!_this.noZoom) {

        _this.zoomCamera();
      }

      if (!_this.noPan) {

        _this.panCamera();
      }

      if (!_this.noCustom) {

        _this.custom(_customStart, _customEnd);
      }

      _this.object.position.addVectors(_this.target, _eye);

      _this.checkDistances();

      _this.object.lookAt(_this.target);

      if (lastPosition.distanceToSquared(_this.object.position) > EPS) {

        _this.dispatchEvent(changeEvent);

        lastPosition.copy(_this.object.position);
      }
    };

    _this2.reset = function () {

      _state = STATE.NONE;
      _prevState = STATE.NONE;

      _this.target.copy(_this.target0);
      _this.object.position.copy(_this.position0);
      _this.object.up.copy(_this.up0);

      _eye.subVectors(_this.object.position, _this.target);

      _this.object.lookAt(_this.target);

      _this.dispatchEvent(changeEvent);

      lastPosition.copy(_this.object.position);
    };

    _this2.setState = function (targetState) {

      _this.forceState = targetState;
      _prevState = targetState;
      _state = targetState;
    };

    _this2.custom = function (customStart, customEnd) {};

    // listeners

    function keydown(event) {

      if (_this.enabled === false) return;

      window.removeEventListener('keydown', keydown);

      _prevState = _state;

      if (_state !== STATE.NONE) {

        return;
      } else if (event.keyCode === _this.keys[STATE.ROTATE] && !_this.noRotate) {

        _state = STATE.ROTATE;
      } else if (event.keyCode === _this.keys[STATE.ZOOM] && !_this.noZoom) {

        _state = STATE.ZOOM;
      } else if (event.keyCode === _this.keys[STATE.PAN] && !_this.noPan) {

        _state = STATE.PAN;
      }
    }

    function keyup(event) {

      if (_this.enabled === false) return;

      _state = _prevState;

      window.addEventListener('keydown', keydown, false);
    }

    function mousedown(event) {

      if (_this.enabled === false) return;

      event.preventDefault();
      event.stopPropagation();

      if (_state === STATE.NONE) {

        _state = event.button;
      }

      if (_state === STATE.ROTATE && !_this.noRotate) {

        _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
        _movePrev.copy(_moveCurr);
      } else if (_state === STATE.ZOOM && !_this.noZoom) {

        _zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
        _zoomEnd.copy(_zoomStart);
      } else if (_state === STATE.PAN && !_this.noPan) {

        _panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
        _panEnd.copy(_panStart);
      } else if (_state === STATE.CUSTOM && !_this.noCustom) {

        _customStart.copy(getMouseOnScreen(event.pageX, event.pageY));
        _customEnd.copy(_panStart);
      }

      document.addEventListener('mousemove', mousemove, false);
      document.addEventListener('mouseup', mouseup, false);

      _this.dispatchEvent(startEvent);
    }

    function mousemove(event) {

      if (_this.enabled === false) return;

      event.preventDefault();
      event.stopPropagation();

      if (_state === STATE.ROTATE && !_this.noRotate) {

        _movePrev.copy(_moveCurr);
        _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
      } else if (_state === STATE.ZOOM && !_this.noZoom) {

        _zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
      } else if (_state === STATE.PAN && !_this.noPan) {

        _panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
      } else if (_state === STATE.CUSTOM && !_this.noCustom) {

        _customEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
      }
    }

    function mouseup(event) {

      if (_this.enabled === false) return;

      event.preventDefault();
      event.stopPropagation();

      if (_this.forceState === -1) {
        _state = STATE.NONE;
      }

      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
      _this.dispatchEvent(endEvent);
    }

    function mousewheel(event) {

      if (_this.enabled === false) return;

      event.preventDefault();
      event.stopPropagation();

      var delta = 0;

      if (event.wheelDelta) {
        // WebKit / Opera / Explorer 9

        delta = event.wheelDelta / 40;
      } else if (event.detail) {
        // Firefox

        delta = -event.detail / 3;
      }

      if (_state !== STATE.CUSTOM) {
        _zoomStart.y += delta * 0.01;
      } else if (_state === STATE.CUSTOM) {
        _customStart.y += delta * 0.01;
      }

      _this.dispatchEvent(startEvent);
      _this.dispatchEvent(endEvent);
    }

    function touchstart(event) {

      if (_this.enabled === false) return;

      if (_this.forceState === -1) {

        switch (event.touches.length) {

          case 1:
            _state = STATE.TOUCH_ROTATE;
            _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
            _movePrev.copy(_moveCurr);
            break;

          case 2:
            _state = STATE.TOUCH_ZOOM;
            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;
            _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

            var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            _panStart.copy(getMouseOnScreen(x, y));
            _panEnd.copy(_panStart);
            break;

          default:
            _state = STATE.NONE;

        }
      } else {

        //{ NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4, CUSTOM: 99 };
        switch (_state) {

          case 0:
            // 1 or 2 fingers, smae behavior
            _state = STATE.TOUCH_ROTATE;
            _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
            _movePrev.copy(_moveCurr);
            break;

          case 1:
          case 4:
            if (event.touches.length >= 2) {
              _state = STATE.TOUCH_ZOOM;
              var dx = event.touches[0].pageX - event.touches[1].pageX;
              var dy = event.touches[0].pageY - event.touches[1].pageY;
              _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);
            } else {
              _state = STATE.ZOOM;
              _zoomStart.copy(getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY));
              _zoomEnd.copy(_zoomStart);
            }
            break;

          case 2:
          case 5:
            if (event.touches.length >= 2) {
              _state = STATE.TOUCH_PAN;
              var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
              var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
              _panStart.copy(getMouseOnScreen(x, y));
              _panEnd.copy(_panStart);
            } else {
              _state = STATE.PAN;
              _panStart.copy(getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY));
              _panEnd.copy(_panStart);
            }
            break;

          case 99:
            _state = STATE.CUSTOM;
            var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            _customStart.copy(getMouseOnScreen(x, y));
            _customEnd.copy(_customStart);
            break;

          default:
            _state = STATE.NONE;

        }
      }

      _this.dispatchEvent(startEvent);
    }

    function touchmove(event) {

      if (_this.enabled === false) return;

      event.preventDefault();
      event.stopPropagation();

      if (_this.forceState === -1) {

        switch (event.touches.length) {

          case 1:
            _movePrev.copy(_moveCurr);
            _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
            break;

          case 2:
            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;
            _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

            var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            _panEnd.copy(getMouseOnScreen(x, y));
            break;

          default:
            _state = STATE.NONE;
        }
      } else {
        //{ NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4, CUSTOM: 99 };
        switch (_state) {

          case 0:
            _movePrev.copy(_moveCurr);
            _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
            break;

          case 1:
            _zoomEnd.copy(getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY));
            break;

          case 2:
            _panEnd.copy(getMouseOnScreen(event.touches[0].pageX, event.touches[0].pageY));
            break;

          case 4:
            // 2 fingers!
            // TOUCH ZOOM
            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;
            _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);
            break;

          case 5:
            // 2 fingers
            // TOUCH_PAN
            var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            _panEnd.copy(getMouseOnScreen(x, y));
            break;

          case 99:
            var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            _customEnd.copy(getMouseOnScreen(x, y));
            break;

          default:
            _state = STATE.NONE;

        }
      }
    }

    function touchend(event) {

      if (_this.enabled === false) return;

      if (_this.forceState === -1) {
        switch (event.touches.length) {

          case 1:
            _movePrev.copy(_moveCurr);
            _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
            break;

          case 2:
            _touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

            var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            _panEnd.copy(getMouseOnScreen(x, y));
            _panStart.copy(_panEnd);
            break;

        }

        _state = STATE.NONE;
      } else {
        switch (_state) {

          case 0:
            _movePrev.copy(_moveCurr);
            _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
            break;

          case 1:
          case 2:
            break;

          case 4:
            // TOUCH ZOOM
            _touchZoomDistanceStart = _touchZoomDistanceEnd = 0;
            _state = STATE.ZOOM;
            break;

          case 5:
            // TOUCH ZOOM
            if (event.touches.length >= 2) {
              var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
              var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
              _panEnd.copy(getMouseOnScreen(x, y));
              _panStart.copy(_panEnd);
            }
            _state = STATE.PAN;
            break;

          case 99:
            var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            _customEnd.copy(getMouseOnScreen(x, y));
            _customStart.copy(_customEnd);
            break;

          default:
            _state = STATE.NONE;

        }
      }

      _this.dispatchEvent(endEvent);
    }

    _this2.domElement.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    }, false);

    _this2.domElement.addEventListener('mousedown', mousedown, false);

    _this2.domElement.addEventListener('mousewheel', mousewheel, false);
    _this2.domElement.addEventListener('DOMMouseScroll', mousewheel, false); // firefox

    _this2.domElement.addEventListener('touchstart', touchstart, false);
    _this2.domElement.addEventListener('touchend', touchend, false);
    _this2.domElement.addEventListener('touchmove', touchmove, false);

    window.addEventListener('keydown', keydown, false);
    window.addEventListener('keyup', keyup, false);

    _this2.handleResize();

    // force an update at start
    _this2.update();

    return _this2;
  }

  return Trackball;
}(THREE.EventDispatcher);

exports.default = Trackball;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin  / http://mark-lundin.com
 * @author Patrick Fuller / http://patrick-fuller.com
 * @author Max Smolens / https://github.com/msmolens
 */

var Trackballortho = function (_THREE$EventDispatche) {
  _inherits(Trackballortho, _THREE$EventDispatche);

  function Trackballortho(object, domElement) {
    _classCallCheck(this, Trackballortho);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Trackballortho).call(this));

    var _this = _this2;
    var STATE = { NONE: -1, ROTATE: 1, ZOOM: 2, PAN: 0, SCROLL: 4, TOUCH_ROTATE: 4, TOUCH_ZOOM_PAN: 5 };

    _this2.object = object;
    _this2.domElement = domElement !== undefined ? domElement : document;

    // API

    _this2.enabled = true;

    _this2.screen = { left: 0, top: 0, width: 0, height: 0 };

    _this2.radius = 0;

    _this2.zoomSpeed = 1.2;

    _this2.noZoom = false;
    _this2.noPan = false;

    _this2.staticMoving = false;
    _this2.dynamicDampingFactor = 0.2;

    _this2.keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];

    // internals

    _this2.target = new THREE.Vector3();

    var EPS = 0.000001;

    var _changed = true;

    var _state = STATE.NONE,
        _prevState = STATE.NONE,
        _eye = new THREE.Vector3(),
        _zoomStart = new THREE.Vector2(),
        _zoomEnd = new THREE.Vector2(),
        _touchZoomDistanceStart = 0,
        _touchZoomDistanceEnd = 0,
        _panStart = new THREE.Vector2(),
        _panEnd = new THREE.Vector2();

    // window level fire after...

    // for reset

    _this2.target0 = _this2.target.clone();
    _this2.position0 = _this2.object.position.clone();
    _this2.up0 = _this2.object.up.clone();

    _this2.left0 = _this2.object.left;
    _this2.right0 = _this2.object.right;
    _this2.top0 = _this2.object.top;
    _this2.bottom0 = _this2.object.bottom;

    // events

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start' };
    var endEvent = { type: 'end' };

    // methods

    _this2.handleResize = function () {

      if (this.domElement === document) {

        this.screen.left = 0;
        this.screen.top = 0;
        this.screen.width = window.innerWidth;
        this.screen.height = window.innerHeight;
      } else {

        var box = this.domElement.getBoundingClientRect();
        // adjustments come from similar code in the jquery offset() function
        var d = this.domElement.ownerDocument.documentElement;
        this.screen.left = box.left + window.pageXOffset - d.clientLeft;
        this.screen.top = box.top + window.pageYOffset - d.clientTop;
        this.screen.width = box.width;
        this.screen.height = box.height;
      }

      this.radius = 0.5 * Math.min(this.screen.width, this.screen.height);

      this.left0 = this.object.left;
      this.right0 = this.object.right;
      this.top0 = this.object.top;
      this.bottom0 = this.object.bottom;
    };

    _this2.handleEvent = function (event) {

      if (typeof this[event.type] == 'function') {

        this[event.type](event);
      }
    };

    var getMouseOnScreen = function () {

      var vector = new THREE.Vector2();

      return function getMouseOnScreen(pageX, pageY) {

        vector.set((pageX - _this.screen.left) / _this.screen.width, (pageY - _this.screen.top) / _this.screen.height);

        return vector;
      };
    }();

    _this2.zoomCamera = function () {

      if (_state === STATE.TOUCH_ZOOM_PAN) {

        var factor = _touchZoomDistanceEnd / _touchZoomDistanceStart;
        _touchZoomDistanceStart = _touchZoomDistanceEnd;

        _this.object.zoom *= factor;

        _changed = true;
      } else {

        var factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;

        if (Math.abs(factor - 1.0) > EPS && factor > 0.0) {

          _this.object.zoom /= factor;

          if (_this.staticMoving) {

            _zoomStart.copy(_zoomEnd);
          } else {

            _zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;
          }

          _changed = true;
        }
      }
    };

    _this2.panCamera = function () {

      var mouseChange = new THREE.Vector2(),
          objectUp = new THREE.Vector3(),
          pan = new THREE.Vector3();

      return function panCamera() {

        mouseChange.copy(_panEnd).sub(_panStart);

        if (mouseChange.lengthSq()) {

          // Scale movement to keep clicked/dragged position under cursor
          var scale_x = (_this.object.right - _this.object.left) / _this.object.zoom;
          var scale_y = (_this.object.top - _this.object.bottom) / _this.object.zoom;
          mouseChange.x *= scale_x;
          mouseChange.y *= scale_y;

          pan.copy(_eye).cross(_this.object.up).setLength(mouseChange.x);
          pan.add(objectUp.copy(_this.object.up).setLength(mouseChange.y));

          _this.object.position.add(pan);
          _this.target.add(pan);

          if (_this.staticMoving) {

            _panStart.copy(_panEnd);
          } else {

            _panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this.dynamicDampingFactor));
          }

          _changed = true;
        }
      };
    }();

    _this2.update = function () {

      _eye.subVectors(_this.object.position, _this.target);

      if (!_this.noZoom) {

        _this.zoomCamera();

        if (_changed) {

          _this.object.updateProjectionMatrix();
        }
      }

      if (!_this.noPan) {

        _this.panCamera();
      }

      _this.object.position.addVectors(_this.target, _eye);

      _this.object.lookAt(_this.target);

      if (_changed) {

        _this.dispatchEvent(changeEvent);

        _changed = false;
      }
    };

    _this2.reset = function () {

      _state = STATE.NONE;
      _prevState = STATE.NONE;

      _this.target.copy(_this.target0);
      _this.object.position.copy(_this.position0);
      _this.object.up.copy(_this.up0);

      _eye.subVectors(_this.object.position, _this.target);

      _this.object.left = _this.left0;
      _this.object.right = _this.right0;
      _this.object.top = _this.top0;
      _this.object.bottom = _this.bottom0;

      _this.object.lookAt(_this.target);

      _this.dispatchEvent(changeEvent);

      _changed = false;
    };

    // listeners

    function keydown(event) {

      if (_this.enabled === false) return;

      window.removeEventListener('keydown', keydown);

      _prevState = _state;

      if (_state !== STATE.NONE) {

        return;
      } else if (event.keyCode === _this.keys[STATE.ROTATE] && !_this.noRotate) {

        _state = STATE.ROTATE;
      } else if (event.keyCode === _this.keys[STATE.ZOOM] && !_this.noZoom) {

        _state = STATE.ZOOM;
      } else if (event.keyCode === _this.keys[STATE.PAN] && !_this.noPan) {

        _state = STATE.PAN;
      }
    }

    function keyup(event) {

      if (_this.enabled === false) return;

      _state = _prevState;

      window.addEventListener('keydown', keydown, false);
    }

    function mousedown(event) {

      if (_this.enabled === false) return;

      event.preventDefault();
      event.stopPropagation();

      if (_state === STATE.NONE) {

        _state = event.button;
      }

      if (_state === STATE.ROTATE && !_this.noRotate) {} else if (_state === STATE.ZOOM && !_this.noZoom) {

        _zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
        _zoomEnd.copy(_zoomStart);
      } else if (_state === STATE.PAN && !_this.noPan) {

        _panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
        _panEnd.copy(_panStart);
      }

      document.addEventListener('mousemove', mousemove, false);
      document.addEventListener('mouseup', mouseup, false);

      _this.dispatchEvent(startEvent);
    }

    function mousemove(event) {

      if (_this.enabled === false) return;

      event.preventDefault();
      event.stopPropagation();

      if (_state === STATE.ROTATE && !_this.noRotate) {} else if (_state === STATE.ZOOM && !_this.noZoom) {

        _zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
      } else if (_state === STATE.PAN && !_this.noPan) {

        _panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
      }
    }

    function mouseup(event) {

      if (_this.enabled === false) return;

      event.preventDefault();
      event.stopPropagation();

      _state = STATE.NONE;

      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
      _this.dispatchEvent(endEvent);
    }

    function mousewheel(event) {

      if (_this.enabled === false) return;

      event.preventDefault();
      event.stopPropagation();

      var delta = 0;

      if (event.wheelDelta) {

        // WebKit / Opera / Explorer 9

        delta = event.wheelDelta / 40;
      } else if (event.detail) {

        // Firefox

        delta = -event.detail / 3;
      }

      // FIRE SCROLL EVENT

      _this.dispatchEvent({
        type: 'OnScroll',
        delta: delta
      });

      //_zoomStart.y += delta * 0.01;
      _this.dispatchEvent(startEvent);
      _this.dispatchEvent(endEvent);
    }

    function touchstart(event) {

      if (_this.enabled === false) return;

      switch (event.touches.length) {

        case 1:
          _state = STATE.TOUCH_ROTATE;

          break;

        case 2:
          _state = STATE.TOUCH_ZOOM_PAN;
          var dx = event.touches[0].pageX - event.touches[1].pageX;
          var dy = event.touches[0].pageY - event.touches[1].pageY;
          _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

          var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
          var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
          _panStart.copy(getMouseOnScreen(x, y));
          _panEnd.copy(_panStart);
          break;

        default:
          _state = STATE.NONE;

      }
      _this.dispatchEvent(startEvent);
    }

    function touchmove(event) {

      if (_this.enabled === false) return;

      event.preventDefault();
      event.stopPropagation();

      switch (event.touches.length) {

        case 1:

          break;

        case 2:
          var dx = event.touches[0].pageX - event.touches[1].pageX;
          var dy = event.touches[0].pageY - event.touches[1].pageY;
          _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

          var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
          var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
          _panEnd.copy(getMouseOnScreen(x, y));
          break;

        default:
          _state = STATE.NONE;

      }
    }

    function touchend(event) {

      if (_this.enabled === false) return;

      switch (event.touches.length) {

        case 1:

          break;

        case 2:
          _touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

          var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
          var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
          _panEnd.copy(getMouseOnScreen(x, y));
          _panStart.copy(_panEnd);
          break;

      }

      _state = STATE.NONE;
      _this.dispatchEvent(endEvent);
    }

    function contextmenu(event) {

      event.preventDefault();
    }

    _this2.dispose = function () {

      this.domElement.removeEventListener('contextmenu', contextmenu, false);
      this.domElement.removeEventListener('mousedown', mousedown, false);
      this.domElement.removeEventListener('mousewheel', mousewheel, false);
      this.domElement.removeEventListener('MozMousePixelScroll', mousewheel, false); // firefox

      this.domElement.removeEventListener('touchstart', touchstart, false);
      this.domElement.removeEventListener('touchend', touchend, false);
      this.domElement.removeEventListener('touchmove', touchmove, false);

      document.removeEventListener('mousemove', mousemove, false);
      document.removeEventListener('mouseup', mouseup, false);

      window.removeEventListener('keydown', keydown, false);
      window.removeEventListener('keyup', keyup, false);
    };

    _this2.domElement.addEventListener('contextmenu', contextmenu, false);
    _this2.domElement.addEventListener('mousedown', mousedown, false);
    _this2.domElement.addEventListener('mousewheel', mousewheel, false);
    _this2.domElement.addEventListener('MozMousePixelScroll', mousewheel, false); // firefox

    _this2.domElement.addEventListener('touchstart', touchstart, false);
    _this2.domElement.addEventListener('touchend', touchend, false);
    _this2.domElement.addEventListener('touchmove', touchmove, false);

    window.addEventListener('keydown', keydown, false);
    window.addEventListener('keyup', keyup, false);

    _this2.handleResize();

    // force an update at start
    _this2.update();

    return _this2;
  }

  return Trackballortho;
}(THREE.EventDispatcher);

exports.default = Trackballortho;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CoreIntersections = function () {
  function CoreIntersections() {
    _classCallCheck(this, CoreIntersections);
  }

  _createClass(CoreIntersections, null, [{
    key: "aabbPlane",


    /**
     * Compute intersection between oriented bounding box and a plane.
     * Returns intersection in plane's space (toAABBInvert applied).
     * Should return at least 3 intersections. If not, the plane and the box do not
     * intersect.
     *
     * @memberOf CoreIntersections
     * @public
     * @static
     *
     * @param {Object} obb - Oriented Bounding Box representation.
     * @param {THREE.Vector3} obb.halfDimensions - Half dimensions of the box.
     * @param {THREE.Vector3} obb.center - Center of the box.
     * @param {THREE.Matrix4} obb.toAABB - Transform to go from plane space to box space.
     * @param {Object} plane - Plane representation
     * @param {THREE.Vector3} plane.position - position of normal which describes the plane.
     * @param {THREE.Vector3} plane.direction - Direction of normal which describes the plane.
     *
     * @returns {Array<THREE.Vector3>} List of all intersections, in plane's space.
     *
     * @todo toAABB and toAABBInvert might be redundent.
     */
    value: function aabbPlane(aabb, plane) {
      //
      // obb = { halfDimensions, orientation, center, toAABB }
      // plane = { position, direction }
      //
      //
      // LOGIC:
      //
      // Test intersection of each edge of the Oriented Bounding Box with the Plane
      //
      // ALL EDGES
      //
      //      .+-------+ 
      //    .' |     .'| 
      //   +---+---+'  | 
      //   |   |   |   | 
      //   |  ,+---+---+ 
      //   |.'     | .'  
      //   +-------+'    
      //
      // SPACE ORIENTATION
      //
      //       +
      //     j |
      //       |
      //       |   i
      //   k  ,+-------+ 
      //    .'
      //   +
      //
      //
      // 1- Move Plane position and orientation in IJK space
      // 2- Test Edges/ IJK Plane intersections
      // 3- Return intersection Edge/ IJK Plane if it touches the Oriented BBox

      var intersections = [];

      // invert space matrix
      var toAABBInvert = new THREE.Matrix4();
      toAABBInvert.getInverse(aabb.toAABB);

      var t1 = plane.direction.clone().applyMatrix4(aabb.toAABB);
      var t0 = new THREE.Vector3(0, 0, 0).applyMatrix4(aabb.toAABB);

      var planeAABB = this.posdir(plane.position.clone().applyMatrix4(aabb.toAABB), new THREE.Vector3(t1.x - t0.x, t1.y - t0.y, t1.z - t0.z).normalize());

      var bboxMin = new THREE.Vector3(aabb.center.x - aabb.halfDimensions.x, aabb.center.y - aabb.halfDimensions.y, aabb.center.z - aabb.halfDimensions.z);
      var bboxMax = new THREE.Vector3(aabb.center.x + aabb.halfDimensions.x, aabb.center.y + aabb.halfDimensions.y, aabb.center.z + aabb.halfDimensions.z);

      var orientation = new THREE.Vector3(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));

      // 12 edges (i.e. ray)/plane intersection tests
      // RAYS STARTING FROM THE FIRST CORNER (0, 0, 0)
      //
      //       +
      //       |
      //       |
      //       |
      //      ,+---+---+
      //    .'  
      //   +  

      var ray = this.posdir(new THREE.Vector3(aabb.center.x - aabb.halfDimensions.x, aabb.center.y - aabb.halfDimensions.y, aabb.center.z - aabb.halfDimensions.z), orientation.x);
      this.rayPlaneInBBox(ray, planeAABB, bboxMin, bboxMax, intersections);

      ray.direction = orientation.y;
      this.rayPlaneInBBox(ray, planeAABB, bboxMin, bboxMax, intersections);

      ray.direction = orientation.z;
      this.rayPlaneInBBox(ray, planeAABB, bboxMin, bboxMax, intersections);

      // RAYS STARTING FROM THE LAST CORNER
      //
      //               +
      //             .'
      //   +-------+'
      //           |
      //           |
      //           |
      //           +
      //

      var ray2 = this.posdir(new THREE.Vector3(aabb.center.x + aabb.halfDimensions.x, aabb.center.y + aabb.halfDimensions.y, aabb.center.z + aabb.halfDimensions.z), orientation.x);
      this.rayPlaneInBBox(ray2, planeAABB, bboxMin, bboxMax, intersections);

      ray2.direction = orientation.y;
      this.rayPlaneInBBox(ray2, planeAABB, bboxMin, bboxMax, intersections);

      ray2.direction = orientation.z;
      this.rayPlaneInBBox(ray2, planeAABB, bboxMin, bboxMax, intersections);

      // RAYS STARTING FROM THE SECOND CORNER
      //
      //               +
      //               |
      //               |
      //               |
      //               +
      //             .'
      //           +'

      var ray3 = this.posdir(new THREE.Vector3(aabb.center.x + aabb.halfDimensions.x, aabb.center.y - aabb.halfDimensions.y, aabb.center.z - aabb.halfDimensions.z), orientation.y);
      this.rayPlaneInBBox(ray3, planeAABB, bboxMin, bboxMax, intersections);

      ray3.direction = orientation.z;
      this.rayPlaneInBBox(ray3, planeAABB, bboxMin, bboxMax, intersections);

      // RAYS STARTING FROM THE THIRD CORNER
      //
      //      .+-------+ 
      //    .'
      //   +
      //  
      //  
      //  
      //  

      var ray4 = this.posdir(new THREE.Vector3(aabb.center.x - aabb.halfDimensions.x, aabb.center.y + aabb.halfDimensions.y, aabb.center.z - aabb.halfDimensions.z), orientation.x);
      this.rayPlaneInBBox(ray4, planeAABB, bboxMin, bboxMax, intersections);

      ray4.direction = orientation.z;
      this.rayPlaneInBBox(ray4, planeAABB, bboxMin, bboxMax, intersections);

      // RAYS STARTING FROM THE FOURTH CORNER
      //
      //  
      //  
      //   +
      //   |
      //   | 
      //   |
      //   +-------+

      var ray5 = this.posdir(new THREE.Vector3(aabb.center.x - aabb.halfDimensions.x, aabb.center.y - aabb.halfDimensions.y, aabb.center.z + aabb.halfDimensions.z), orientation.x);
      this.rayPlaneInBBox(ray5, planeAABB, bboxMin, bboxMax, intersections);

      ray5.direction = orientation.y;
      this.rayPlaneInBBox(ray5, planeAABB, bboxMin, bboxMax, intersections);

      // back to original space
      intersections.map(function (element) {
        return element.applyMatrix4(toAABBInvert);
      });

      return intersections;
    }

    /**
     * Compute intersection between a ray and a plane.
     *
     * @memberOf this
     * @public
     *
     * @param {Object} ray - Ray representation.
     * @param {THREE.Vector3} ray.position - position of normal which describes the ray.
     * @param {THREE.Vector3} ray.direction - Direction of normal which describes the ray.
     * @param {Object} plane - Plane representation
     * @param {THREE.Vector3} plane.position - position of normal which describes the plane.
     * @param {THREE.Vector3} plane.direction - Direction of normal which describes the plane.
     *
     * @returns {THREE.Vector3|null} Intersection between ray and plane or null.
     */

  }, {
    key: "rayPlane",
    value: function rayPlane(ray, plane) {
      // ray: {position, direction}
      // plane: {position, direction}

      if (ray.direction.dot(plane.direction) !== 0) {
        //
        // not parallel, move forward
        //
        // LOGIC:
        //
        // Ray equation: P = P0 + tV
        // P = <Px, Py, Pz>
        // P0 = <ray.position.x, ray.position.y, ray.position.z>
        // V = <ray.direction.x, ray.direction.y, ray.direction.z>
        //
        // Therefore:
        // Px = ray.position.x + t*ray.direction.x
        // Py = ray.position.y + t*ray.direction.y
        // Pz = ray.position.z + t*ray.direction.z
        //
        //
        //
        // Plane equation: ax + by + cz + d = 0
        // a = plane.direction.x
        // b = plane.direction.y
        // c = plane.direction.z
        // d = -( plane.direction.x*plane.position.x +
        //        plane.direction.y*plane.position.y +
        //        plane.direction.z*plane.position.z )
        //
        //
        // 1- in the plane equation, we replace x, y and z by Px, Py and Pz
        // 2- find t
        // 3- replace t in Px, Py and Pz to get the coordinate of the intersection
        //
        var t = (plane.direction.x * (plane.position.x - ray.position.x) + plane.direction.y * (plane.position.y - ray.position.y) + plane.direction.z * (plane.position.z - ray.position.z)) / (plane.direction.x * ray.direction.x + plane.direction.y * ray.direction.y + plane.direction.z * ray.direction.z);

        var intersection = new THREE.Vector3(ray.position.x + t * ray.direction.x, ray.position.y + t * ray.direction.y, ray.position.z + t * ray.direction.z);

        return intersection;
      }

      return null;
    }
  }, {
    key: "rayBox",
    value: function rayBox(ray, box) {
      // should also do the space transforms here
      // ray: {position, direction}
      // box: {halfDimensions, center}

      var intersections = [];

      var bboxMin = new THREE.Vector3(box.center.x - box.halfDimensions.x, box.center.y - box.halfDimensions.y, box.center.z - box.halfDimensions.z);
      var bboxMax = new THREE.Vector3(box.center.x + box.halfDimensions.x, box.center.y + box.halfDimensions.y, box.center.z + box.halfDimensions.z);

      // X min
      var plane = this.posdir(new THREE.Vector3(bboxMin.x, box.center.y, box.center.z), new THREE.Vector3(-1, 0, 0));
      this.rayPlaneInBBox(ray, plane, bboxMin, bboxMax, intersections);

      // X max
      plane = this.posdir(new THREE.Vector3(bboxMax.x, box.center.y, box.center.z), new THREE.Vector3(1, 0, 0));
      this.rayPlaneInBBox(ray, plane, bboxMin, bboxMax, intersections);

      // Y min
      plane = this.posdir(new THREE.Vector3(box.center.x, bboxMin.y, box.center.z), new THREE.Vector3(0, -1, 0));
      this.rayPlaneInBBox(ray, plane, bboxMin, bboxMax, intersections);

      // Y max
      plane = this.posdir(new THREE.Vector3(box.center.x, bboxMax.y, box.center.z), new THREE.Vector3(0, 1, 0));
      this.rayPlaneInBBox(ray, plane, bboxMin, bboxMax, intersections);

      // Z min
      plane = this.posdir(new THREE.Vector3(box.center.x, box.center.y, bboxMin.z), new THREE.Vector3(0, 0, -1));
      this.rayPlaneInBBox(ray, plane, bboxMin, bboxMax, intersections);

      // Z max
      plane = this.posdir(new THREE.Vector3(box.center.x, box.center.y, bboxMax.z), new THREE.Vector3(0, 0, 1));
      this.rayPlaneInBBox(ray, plane, bboxMin, bboxMax, intersections);

      return intersections;
    }
  }, {
    key: "rayPlaneInBBox",
    value: function rayPlaneInBBox(ray, planeAABB, bboxMin, bboxMax, intersections) {
      var intersection = this.rayPlane(ray, planeAABB);
      if (intersection && this.inBBox(intersection, bboxMin, bboxMax)) {
        intersections.push(intersection);
      }
    }
  }, {
    key: "inBBox",
    value: function inBBox(point, bboxMin, bboxMax) {
      if (point && point.x >= bboxMin.x && point.y >= bboxMin.y && point.z >= bboxMin.z && point.x <= bboxMax.x && point.y <= bboxMax.y && point.z <= bboxMax.z) {
        return true;
      }
      return false;
    }
  }, {
    key: "posdir",
    value: function posdir(position, direction) {
      return { position: position, direction: direction };
    }
  }]);

  return CoreIntersections;
}();

exports.default = CoreIntersections;

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core.intersections');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import Pack from './core.pack';

exports.default = {
  Intersections: _core2.default
  //,
  //  Pack
};

},{"./core.intersections":17}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _geometries = require('./geometries.slice');

var _geometries2 = _interopRequireDefault(_geometries);

var _geometries3 = require('./geometries.voxel');

var _geometries4 = _interopRequireDefault(_geometries3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Slice: _geometries2.default,
  Voxel: _geometries4.default
};

},{"./geometries.slice":20,"./geometries.voxel":21}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../../src/core/core.intersections');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*** Imports ***/


/**
 *
 * It is typically used for creating an irregular 3D planar shape given a box and the cut-plane.
 *
 * Demo: {@link https://fnndsc.github.io/vjs#geometry_slice}
 *
 * @constructor
 * @class
 * @memberOf VJS.geometries
 * @public
 *
 * @param {THREE.Vector3} halfDimensions - Half-dimensions of the box to be sliced.
 * @param {THREE.Vector3} center - Center of the box to be sliced.
 * @param {THREE.Vector3<THREE.Vector3>} orientation - Orientation of the box to be sliced. (might not be necessary..?)
 * @param {THREE.Vector3} position - Position of the cutting plane.
 * @param {THREE.Vector3} direction - Cross direction of the cutting plane.
 *
 * @example
 * // Define box to be sliced
 * let halfDimensions = new THREE.Vector(123, 45, 67);
 * let center = new THREE.Vector3(0, 0, 0);
 * let orientation = new THREE.Vector3(
 *   new THREE.Vector3(1, 0, 0),
 *   new THREE.Vector3(0, 1, 0),
 *   new THREE.Vector3(0, 0, 1)
 * );
 *
 * // Define slice plane
 * let position = center.clone();
 * let direction = new THREE.Vector3(-0.2, 0.5, 0.3);
 *
 * // Create the slice geometry & materials
 * let sliceGeometry = new VJS.geometries.slice(halfDimensions, center, orientation, position, direction);
 * let sliceMaterial = new THREE.MeshBasicMaterial({
 *   'side': THREE.DoubleSide,
 *   'color': 0xFF5722
 * });
 *
 *  // Create mesh and add it to the scene
 *  let slice = new THREE.Mesh(sliceGeometry, sliceMaterial);
 *  scene.add(slice);
 */

var GeometriesSlice = function (_THREE$ShapeGeometry) {
  _inherits(GeometriesSlice, _THREE$ShapeGeometry);

  function GeometriesSlice(halfDimensions, center, position, direction) {
    var toAABB = arguments.length <= 4 || arguments[4] === undefined ? new THREE.Matrix4() : arguments[4];

    _classCallCheck(this, GeometriesSlice);

    //
    // prepare data for the shape!
    //
    var aabb = {
      halfDimensions: halfDimensions,
      center: center,
      toAABB: toAABB
    };

    var plane = {
      position: position,
      direction: direction
    };

    // BOOM!
    var intersections = _core2.default.aabbPlane(aabb, plane);

    // can not exist before calling the constructor
    if (intersections.length < 3) {
      window.console.log('WARNING: Less than 3 intersections between AABB and Plane.');
      window.console.log('AABB');
      window.console.log(aabb);
      window.console.log('Plane');
      window.console.log(plane);
      window.console.log('exiting...');
      // or throw error?
      throw 'geometries.slice has less than 3 intersections, can not create a valid geometry.';
    }

    var orderedIntersections = GeometriesSlice.orderIntersections(intersections, direction);
    var sliceShape = GeometriesSlice.shape(orderedIntersections);

    //
    // Generate Geometry from shape
    // It does triangulation for us!
    //

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GeometriesSlice).call(this, sliceShape));

    _this.type = 'SliceGeometry';

    // update real position of each vertex! (not in 2d)
    _this.vertices = orderedIntersections;
    _this.verticesNeedUpdate = true;
    return _this;
  }

  _createClass(GeometriesSlice, null, [{
    key: 'shape',
    value: function shape(points) {
      //
      // Create Shape
      //
      var shape = new THREE.Shape();
      // move to first point!
      shape.moveTo(points[0].xy.x, points[0].xy.y);

      // loop through all points!
      for (var l = 1; l < points.length; l++) {
        // project each on plane!
        shape.lineTo(points[l].xy.x, points[l].xy.y);
      }

      // close the shape!
      shape.lineTo(points[0].xy.x, points[0].xy.y);
      return shape;
    }

    /**
     *
     * Convenience function to extract center of mass from list of points.
     *
     * @private
     *
     * @param {Array<THREE.Vector3>} points - Set of points from which we want to extract the center of mass.
     *
     * @returns {THREE.Vector3} Center of mass from given points.
     */

  }, {
    key: 'centerOfMass',
    value: function centerOfMass(points) {
      var centerOfMass = new THREE.Vector3(0, 0, 0);
      for (var i = 0; i < points.length; i++) {
        centerOfMass.x += points[i].x;
        centerOfMass.y += points[i].y;
        centerOfMass.z += points[i].z;
      }
      centerOfMass.divideScalar(points.length);

      return centerOfMass;
    }

    /**
     *
     * Order 3D planar points around a refence point.
     *
     * @private
     *
     * @param {Array<THREE.Vector3>} points - Set of planar 3D points to be ordered.
     * @param {THREE.Vector3} direction - Direction of the plane in which points and reference are sitting.
     *
     * @returns {Array<Object>} Set of object representing the ordered points.
     */

  }, {
    key: 'orderIntersections',
    value: function orderIntersections(points, direction) {

      var reference = GeometriesSlice.centerOfMass(points);
      // direction from first point to reference
      var referenceDirection = new THREE.Vector3(points[0].x - reference.x, points[0].y - reference.y, points[0].z - reference.z).normalize();

      var base = new THREE.Vector3(0, 0, 0).crossVectors(referenceDirection, direction).normalize();

      var orderedpoints = [];

      // other lines // if inter, return location + angle
      for (var j = 0; j < points.length; j++) {
        var point = new THREE.Vector3(points[j].x, points[j].y, points[j].z);
        point.direction = new THREE.Vector3(points[j].x - reference.x, points[j].y - reference.y, points[j].z - reference.z).normalize();

        var x = referenceDirection.dot(point.direction);
        var y = base.dot(point.direction);
        point.xy = { x: x, y: y };

        var theta = Math.atan2(y, x) * (180 / Math.PI);
        point.angle = theta;

        orderedpoints.push(point);
      }

      orderedpoints.sort(function (a, b) {
        return a.angle - b.angle;
      });

      return orderedpoints;
    }
  }]);

  return GeometriesSlice;
}(THREE.ShapeGeometry);

exports.default = GeometriesSlice;

},{"../../src/core/core.intersections":17}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GeometriesVoxel = function (_THREE$BoxGeometry) {
  _inherits(GeometriesVoxel, _THREE$BoxGeometry);

  function GeometriesVoxel(dataPosition) {
    _classCallCheck(this, GeometriesVoxel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GeometriesVoxel).call(this, 1, 1, 1));

    _this._location = dataPosition;

    _this.applyMatrix(new THREE.Matrix4().makeTranslation(_this._location.x, _this._location.y, _this._location.z));

    _this.verticesNeedUpdate = true;
    return _this;
  }

  _createClass(GeometriesVoxel, [{
    key: "resetVertices",
    value: function resetVertices() {
      this.vertices[0].set(0.5, 0.5, 0.5);
      this.vertices[1].set(0.5, 0.5, -0.5);
      this.vertices[2].set(0.5, -0.5, 0.5);
      this.vertices[3].set(0.5, -0.5, -0.5);
      this.vertices[4].set(-0.5, 0.5, -0.5);
      this.vertices[5].set(-0.5, 0.5, 0.5);
      this.vertices[6].set(-0.5, -0.5, -0.5);
      this.vertices[7].set(-0.5, -0.5, 0.5);
    }
  }, {
    key: "location",
    set: function set(location) {
      this._location = location;

      // update vertices from location
      this.vertices[0].set(+0.5, +0.5, +0.5);
      this.vertices[1].set(+0.5, +0.5, -0.5);
      this.vertices[2].set(+0.5, -0.5, +0.5);
      this.vertices[3].set(+0.5, -0.5, -0.5);
      this.vertices[4].set(-0.5, +0.5, -0.5);
      this.vertices[5].set(-0.5, +0.5, +0.5);
      this.vertices[6].set(-0.5, -0.5, -0.5);
      this.vertices[7].set(-0.5, -0.5, +0.5);

      this.applyMatrix(new THREE.Matrix4().makeTranslation(this._location.x, this._location.y, this._location.z));

      this.verticesNeedUpdate = true;
    },
    get: function get() {
      return this._location;
    }
  }]);

  return GeometriesVoxel;
}(THREE.BoxGeometry);

exports.default = GeometriesVoxel;

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*** Imports ***/

var HelpersBorder = function (_THREE$Object3D) {
  _inherits(HelpersBorder, _THREE$Object3D);

  function HelpersBorder(helpersSlice) {
    _classCallCheck(this, HelpersBorder);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HelpersBorder).call(this));
    //


    _this._helpersSlice = helpersSlice;

    _this._visible = true;
    _this._color = 0xff0000;
    _this._material = null;
    _this._geometry = null;
    _this._mesh = null;

    _this._create();
    return _this;
  }

  _createClass(HelpersBorder, [{
    key: '_create',
    value: function _create() {
      if (!this._material) {
        this._material = new THREE.LineBasicMaterial({
          color: this._color,
          linewidth: 1
        });
      }

      //
      if (!this._helpersSlice.geometry.vertices) {
        return;
      }

      this._geometry = new THREE.Geometry();
      for (var i = 0; i < this._helpersSlice.geometry.vertices.length; i++) {
        this._geometry.vertices.push(this._helpersSlice.geometry.vertices[i]);
      }
      this._geometry.vertices.push(this._helpersSlice.geometry.vertices[0]);

      this._mesh = new THREE.Line(this._geometry, this._material);
      if (this._helpersSlice.aabbSpace === 'IJK') {
        this._mesh.applyMatrix(this._helpersSlice.stack.ijk2LPS);
      }
      this._mesh.visible = this._visible;

      // and add it!
      this.add(this._mesh);
    }
  }, {
    key: '_update',
    value: function _update() {
      //update slice
      if (this._mesh) {
        this.remove(this._mesh);
        this._mesh.geometry.dispose();
        this._mesh = null;
      }

      this._create();
    }
  }, {
    key: 'helpersSlice',
    set: function set(helpersSlice) {
      this._helpersSlice = helpersSlice;
      this._update();
    },
    get: function get() {
      return this._helpersSlice;
    }
  }, {
    key: 'visible',
    set: function set(visible) {
      this._visible = visible;
      if (this._mesh) {
        this._mesh.visible = this._visible;
      }
    },
    get: function get() {
      return this._visible;
    }
  }, {
    key: 'color',
    set: function set(color) {
      this._color = color;
      if (this._material) {
        this._material.color.setHex(this._color);
      }
    },
    get: function get() {
      return this._color;
    }
  }]);

  return HelpersBorder;
}(THREE.Object3D);

exports.default = HelpersBorder;

},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HelpersBoundingBox = function (_THREE$Object3D) {
  _inherits(HelpersBoundingBox, _THREE$Object3D);

  function HelpersBoundingBox(stack) {
    _classCallCheck(this, HelpersBoundingBox);

    // private vars

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HelpersBoundingBox).call(this));
    //


    _this._stack = stack;
    _this._visible = true;
    _this._color = 0x61F2F3;
    _this._material = null;
    _this._geometry = null;
    _this._mesh = null;

    // create object
    _this._create();
    return _this;
  }

  // getters/setters


  _createClass(HelpersBoundingBox, [{
    key: "_create",


    // private methods
    value: function _create() {
      // Convenience vars
      var dimensions = this._stack.dimensionsIJK;
      var halfDimensions = this._stack.halfDimensionsIJK;
      var offset = new THREE.Vector3(-0.5, -0.5, -0.5);

      // Geometry
      this._geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
      // position bbox in image space
      this._geometry.applyMatrix(new THREE.Matrix4().makeTranslation(halfDimensions.x + offset.x, halfDimensions.y + offset.y, halfDimensions.z + offset.z));

      // Material
      this._material = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: this._color
      });

      // mesh
      this._mesh = new THREE.Mesh(this._geometry, this._material);
      // position bbox in world space
      this._mesh.applyMatrix(this._stack.ijk2LPS);
      this._mesh.visible = this._visible;

      // and add it!
      this.add(this._mesh);
    }
  }, {
    key: "_update",
    value: function _update() {
      // update slice
      if (this._mesh) {
        this.remove(this._mesh);
        this._mesh.geometry.dispose();
        this._mesh.geometry = null;
        this._mesh.material.dispose();
        this._mesh.material = null;
        this._mesh = null;
      }

      this._create();
    }
  }, {
    key: "visible",
    set: function set(visible) {
      this._visible = visible;
      if (this._mesh) {
        this._mesh.visible = this._visible;
      }
    },
    get: function get() {
      return this._visible;
    }
  }, {
    key: "color",
    set: function set(color) {
      this._color = color;
      if (this._material) {
        this._material.color.setHex(this._color);
      }
    },
    get: function get() {
      return this._color;
    }
  }]);

  return HelpersBoundingBox;
}(THREE.Object3D);

exports.default = HelpersBoundingBox;

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('./helpers.border');

var _helpers2 = _interopRequireDefault(_helpers);

var _helpers3 = require('./helpers.boundingbox');

var _helpers4 = _interopRequireDefault(_helpers3);

var _helpers5 = require('./helpers.lut');

var _helpers6 = _interopRequireDefault(_helpers5);

var _helpers7 = require('./helpers.slice');

var _helpers8 = _interopRequireDefault(_helpers7);

var _helpers9 = require('./helpers.stack');

var _helpers10 = _interopRequireDefault(_helpers9);

var _helpers11 = require('./helpers.voxel');

var _helpers12 = _interopRequireDefault(_helpers11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Border: _helpers2.default,
  BoundingBox: _helpers4.default,
  Lut: _helpers6.default,
  Slice: _helpers8.default,
  Stack: _helpers10.default,
  Voxel: _helpers12.default
};

},{"./helpers.border":22,"./helpers.boundingbox":23,"./helpers.lut":25,"./helpers.slice":26,"./helpers.stack":27,"./helpers.voxel":28}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HelpersLut = function () {
  function HelpersLut(containerID) {
    var lut = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];
    var lutO = arguments.length <= 2 || arguments[2] === undefined ? 'linear' : arguments[2];
    var color = arguments.length <= 3 || arguments[3] === undefined ? [[0, 0, 0, 0], [1, 1, 1, 1]] : arguments[3];
    var opacity = arguments.length <= 4 || arguments[4] === undefined ? [[0, 0], [1, 1]] : arguments[4];

    _classCallCheck(this, HelpersLut);

    // min/max (0-1 or real intensities)
    // show/hide
    // horizontal/vertical
    this._containerID = containerID;

    this._color = color;
    this._lut = lut;
    this._luts = _defineProperty({}, lut, color);

    this._opacity = opacity;
    this._lutO = lutO;
    this._lutsO = _defineProperty({}, lutO, opacity);

    this.initCanvas();
    this.paintCanvas();
  }

  _createClass(HelpersLut, [{
    key: 'initCanvas',
    value: function initCanvas() {
      // container
      this._canvasContainer = this.initCanvasContainer(this._containerID);
      // background
      this._canvasBg = this.createCanvas();
      this._canvasContainer.appendChild(this._canvasBg);
      // foreground
      this._canvas = this.createCanvas();
      this._canvasContainer.appendChild(this._canvas);
    }
  }, {
    key: 'initCanvasContainer',
    value: function initCanvasContainer(canvasContainerId) {
      var canvasContainer = document.getElementById(canvasContainerId);
      canvasContainer.style.width = '256 px';
      canvasContainer.style.height = '128 px';
      canvasContainer.style.border = '1px solid #F9F9F9';
      return canvasContainer;
    }
  }, {
    key: 'createCanvas',
    value: function createCanvas() {
      var canvas = document.createElement('canvas');
      canvas.height = 16;
      canvas.width = 256;
      return canvas;
    }
  }, {
    key: 'paintCanvas',
    value: function paintCanvas() {
      // setup context
      var ctx = this._canvas.getContext('2d');
      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      // apply color
      var color = ctx.createLinearGradient(0, 0, this._canvas.width, this._canvas.height);
      for (var i = 0; i < this._color.length; i++) {
        color.addColorStop(this._color[i][0], 'rgba(' + Math.round(this._color[i][1] * 255) + ', ' + Math.round(this._color[i][2] * 255) + ', ' + Math.round(this._color[i][3] * 255) + ', 1)');
      }
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

      // setup context
      ctx.globalCompositeOperation = 'destination-in';

      // apply opacity
      var opacity = ctx.createLinearGradient(0, 0, this._canvas.width, this._canvas.height);
      for (var i = 0; i < this._opacity.length; i++) {
        opacity.addColorStop(this._opacity[i][0], 'rgba(255, 255, 255, ' + this._opacity[i][1] + ')');
      }
      ctx.fillStyle = opacity;
      ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
  }, {
    key: 'lutsAvailable',
    value: function lutsAvailable() {
      var type = arguments.length <= 0 || arguments[0] === undefined ? 'color' : arguments[0];

      var available = [];
      var luts = this._luts;

      if (type !== 'color') {
        luts = this._lutsO;
      }

      for (var i in luts) {
        available.push(i);
      }

      return available;
    }

    // add luts to class' lut (so a user can add its own as well)

  }, {
    key: 'texture',
    get: function get() {
      var texture = new THREE.Texture(this._canvas);
      texture.mapping = THREE.UVMapping;
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.magFilter = texture.minFilter = THREE.NearestFilter;
      texture.premultiplyAlpha = true;
      texture.needsUpdate = true;
      return texture;
    }
  }, {
    key: 'lut',
    set: function set(targetLUT) {
      this._color = this._luts[targetLUT];
      this._lut = targetLUT;

      this.paintCanvas();
    },
    get: function get() {
      return this._lut;
    }
  }, {
    key: 'luts',
    set: function set(newLuts) {
      this._luts = newLuts;
    },
    get: function get() {
      return this._luts;
    }
  }, {
    key: 'lutO',
    set: function set(targetLUTO) {
      this._opacity = this._lutsO[targetLUTO];
      this._lutO = targetLUTO;

      this.paintCanvas();
    },
    get: function get() {
      return this._lutO;
    }
  }, {
    key: 'lutsO',
    set: function set(newLutsO) {
      this._lutsO = newLutsO;
    },
    get: function get() {
      return this._lutsO;
    }
  }], [{
    key: 'presetLuts',
    value: function presetLuts() {
      return {
        'default': [[0, 0, 0, 0], [1, 1, 1, 1]],
        'spectrum': [[0, 0, 0, 0], [0.1, 0, 0, 1], [0.33, 0, 1, 1], [0.5, 0, 1, 0], [0.66, 1, 1, 0], [0.9, 1, 0, 0], [1, 1, 1, 1]],
        'hot_and_cold': [[0, 0, 0, 1], [0.15, 0, 1, 1], [0.3, 0, 1, 0], [0.45, 0, 0, 0], [0.5, 0, 0, 0], [0.55, 0, 0, 0], [0.7, 1, 1, 0], [0.85, 1, 0, 0], [1, 1, 1, 1]],
        'gold': [[0, 0, 0, 0], [0.13, 0.19, 0.03, 0], [0.25, 0.39, 0.12, 0], [0.38, 0.59, 0.26, 0], [0.50, 0.80, 0.46, 0.08], [0.63, 0.99, 0.71, 0.21], [0.75, 0.99, 0.88, 0.34], [0.88, 0.99, 0.99, 0.48], [1, 0.90, 0.95, 0.61]],
        'red': [[0, 0.75, 0, 0], [0.5, 1, 0.5, 0], [0.95, 1, 1, 0], [1, 1, 1, 1]],
        'green': [[0, 0, 0.75, 0], [0.5, 0.5, 1, 0], [0.95, 1, 1, 0], [1, 1, 1, 1]],
        'blue': [[0, 0, 0, 1], [0.5, 0, 0.5, 1], [0.95, 0, 1, 1], [1, 1, 1, 1]],
        'walking_dead': [[0, 0, 0, 1], [1, 1, 1, 1]]
      };
    }
  }, {
    key: 'presetLutsO',
    value: function presetLutsO() {
      return {
        'linear': [[0, 0], [1, 1]],
        'lowpass': [[0, 0.8], [0.2, 0.6], [0.3, 0.1], [1, 0]],
        'bandpass': [[0, 0], [0.4, 0.8], [0.6, 0.8], [1, 0]],
        'highpass': [[0, 0], [0.7, 0.1], [0.8, 0.6], [1, 0.8]]
      };
    }
  }]);

  return HelpersLut;
}();

exports.default = HelpersLut;

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _geometries = require('../../src/geometries/geometries.slice');

var _geometries2 = _interopRequireDefault(_geometries);

var _shaders = require('../../src/shaders/shaders.data');

var _shaders2 = _interopRequireDefault(_shaders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var HelpersSlice = function (_THREE$Object3D) {
  _inherits(HelpersSlice, _THREE$Object3D);

  function HelpersSlice(stack) {
    var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var position = arguments.length <= 2 || arguments[2] === undefined ? new THREE.Vector3(0, 0, 0) : arguments[2];
    var direction = arguments.length <= 3 || arguments[3] === undefined ? new THREE.Vector3(0, 0, 1) : arguments[3];
    var aabbSpace = arguments.length <= 4 || arguments[4] === undefined ? 'IJK' : arguments[4];

    _classCallCheck(this, HelpersSlice);

    // private vars

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HelpersSlice).call(this));
    //


    _this._stack = stack;

    // image settings
    // index only used to grab window/level and intercept/slope
    _this._invert = false;
    _this._lut = 'none';
    _this._lutTexture = null;
    // if auto === true, get from index
    // else from stack which holds the default values
    _this._intensityAuto = true;
    // starts at 0
    _this._index = index;
    _this._windowWidth = null;
    _this._windowCenter = null;
    _this._rescaleSlope = null;
    _this._rescaleIntercept = null;

    // Object3D settings
    // shape
    _this._planePosition = position;
    _this._planeDirection = direction;
    // change aaBBSpace changes the box dimensions
    // also changes the transform
    // there is also a switch to move back mesh to LPS space automatically
    _this._aaBBspace = aabbSpace; // or LPS -> different transforms, esp for the geometry/mesh
    _this._material = null;
    _this._uniforms = _shaders2.default.uniforms();
    _this._geometry = null;
    _this._mesh = null;
    _this._visible = true;

    // update dimensions, center, etc.
    // depending on aaBBSpace
    _this._init();

    // update object
    _this._create();
    return _this;
  }

  // getters/setters

  _createClass(HelpersSlice, [{
    key: '_init',
    value: function _init() {
      if (!this._stack || !this._stack._prepared || !this._stack._packed) {
        return;
      }

      if (this._aaBBspace === 'IJK') {
        this._halfDimensions = this._stack.halfDimensionsIJK;
        this._center = new THREE.Vector3(this._stack.halfDimensionsIJK.x - 0.5, this._stack.halfDimensionsIJK.y - 0.5, this._stack.halfDimensionsIJK.z - 0.5);
        this._toAABB = new THREE.Matrix4();
      } else {
        // LPS
        var aaBBox = this._stack.AABBox();
        this._halfDimensions = aaBBox.clone().multiplyScalar(0.5);
        this._center = this._stack.centerAABBox();
        this._toAABB = this._stack.lps2AABB;
      }
    }

    // private methods

  }, {
    key: '_create',
    value: function _create() {

      if (!this._stack || !this._stack.prepared || !this._stack.packed) {
        return;
      }

      // Convenience vars
      try {
        this._geometry = new _geometries2.default(this._halfDimensions, this._center, this._planePosition, this._planeDirection, this._toAABB);
      } catch (e) {
        window.console.log(e);
        window.console.log('invalid slice geometry - exiting...');
        return;
      }

      if (!this._geometry.vertices) {
        return;
      }

      if (!this._material) {
        //
        this._uniforms.uTextureSize.value = this._stack.textureSize;
        this._uniforms.uDataDimensions.value = [this._stack.dimensionsIJK.x, this._stack.dimensionsIJK.y, this._stack.dimensionsIJK.z];
        this._uniforms.uWorldToData.value = this._stack.lps2IJK;
        this._uniforms.uNumberOfChannels.value = this._stack.numberOfChannels;
        this._uniforms.uBitsAllocated.value = this._stack.bitsAllocated;

        // compute texture if material exist
        var textures = [];
        // replace 7 by a letiable!!!!
        for (var m = 0; m < this._stack.rawData.length; m++) {
          var tex = new THREE.DataTexture(this._stack.rawData[m], this._stack.textureSize, this._stack.textureSize, this._stack.textureType, THREE.UnsignedByteType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter);
          tex.needsUpdate = true;
          tex.flipY = true;
          textures.push(tex);
        }

        this._uniforms.uTextureContainer.value = textures;

        this._material = new THREE.ShaderMaterial({
          'side': THREE.DoubleSide,
          'uniforms': this._uniforms,
          'vertexShader': "#define GLSLIFY 1\nvarying vec4 vPos;\n\n//\n// main\n//\nvoid main() {\n\n  vPos = modelMatrix * vec4(position, 1.0 );\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );\n\n}",
          'fragmentShader': "#define GLSLIFY 1\nuniform int uTextureSize;\nuniform float uWindowCenterWidth[2];\nuniform float uRescaleSlopeIntercept[2];\nuniform sampler2D uTextureContainer[7];\nuniform ivec3 uDataDimensions;\nuniform mat4 uWorldToData;\nuniform int uNumberOfChannels;\nuniform int uBitsAllocated;\nuniform int uInvert;\n\n// hack because can not pass arrays if too big\n// best would be to pass texture but have to deal with 16bits\nuniform int uLut;\nuniform sampler2D uTextureLUT;\n\nvarying vec4 vPos;\n\n// include functions\nvec4 unpack( vec4 packedRGBA,\n             int bitsAllocated,\n             int signedNumber,\n             int numberOfChannels) {\n  // always return a vec4\n  vec4 unpacked = vec4(0, 0, 0, 0);\n\n  if(numberOfChannels == 1){\n    if(bitsAllocated == 8 || bitsAllocated == 1){\n      unpacked.x = packedRGBA.r * 256.;\n    }\n    else if(bitsAllocated == 16){\n      unpacked.x = packedRGBA.r * 256. + packedRGBA.a * 65536.;\n    }\n    else if(bitsAllocated == 32){\n      unpacked.x = packedRGBA.r * 256. + packedRGBA.g * 65536. + + packedRGBA.b * 16777216. + + packedRGBA.a * 4294967296.;\n    }\n  }\n  else if(numberOfChannels == 3){\n    unpacked = packedRGBA;\n  }\n  return unpacked;\n}\n\n// Support up to textureSize*textureSize*7 voxels\n\nvec4 texture3DPolyfill(ivec3 dataCoordinates,\n                       ivec3 dataDimensions,\n                       int textureSize,\n                       sampler2D textureContainer0,\n                       sampler2D textureContainer1,\n                       sampler2D textureContainer2,\n                       sampler2D textureContainer3,\n                       sampler2D textureContainer4,\n                       sampler2D textureContainer5,\n                       sampler2D textureContainer6,\n                       sampler2D textureContainer[7] // not working on Moto X 2014\n  ) {\n\n  // Model coordinate to data index\n  int index = dataCoordinates.x\n            + dataCoordinates.y * dataDimensions.x\n            + dataCoordinates.z * dataDimensions.y * dataDimensions.x;\n\n  // Map data index to right sampler2D texture\n  int voxelsPerTexture = textureSize*textureSize;\n  int textureIndex = int(floor(float(index) / float(voxelsPerTexture)));\n  // modulo seems incorrect sometimes...\n  // int inTextureIndex = int(mod(float(index), float(textureSize*textureSize)));\n  int inTextureIndex = index - voxelsPerTexture*textureIndex;\n\n  // Get row and column in the texture\n  int colIndex = int(mod(float(inTextureIndex), float(textureSize)));\n  int rowIndex = int(floor(float(inTextureIndex)/float(textureSize)));\n\n  // Map row and column to uv\n  vec2 uv = vec2(0,0);\n  uv.x = (0.5 + float(colIndex)) / float(textureSize);\n  uv.y = 1. - (0.5 + float(rowIndex)) / float(textureSize);\n\n  //\n  vec4 dataValue = vec4(0., 0., 0., 0.);\n  if(textureIndex == 0){ dataValue = texture2D(textureContainer0, uv); }\n  else if(textureIndex == 1){dataValue = texture2D(textureContainer1, uv);}\n  else if(textureIndex == 2){ dataValue = texture2D(textureContainer2, uv); }\n  else if(textureIndex == 3){ dataValue = texture2D(textureContainer3, uv); }\n  else if(textureIndex == 4){ dataValue = texture2D(textureContainer4, uv); }\n  else if(textureIndex == 5){ dataValue = texture2D(textureContainer5, uv); }\n  else if(textureIndex == 6){ dataValue = texture2D(textureContainer6, uv); }\n\n  return dataValue;\n}\n\nvoid main(void) {\n\n  // get texture coordinates of current pixel\n  // doesn't need that in theory\n  vec4 dataCoordinatesRaw = uWorldToData * vPos;\n  // rounding trick\n  // first center of first voxel in data space is CENTERED on (0,0,0)\n  dataCoordinatesRaw += 0.5;\n  ivec3 dataCoordinates = ivec3(int(floor(dataCoordinatesRaw.x)), int(floor(dataCoordinatesRaw.y)), int(floor(dataCoordinatesRaw.z)));\n\n  // if data in range, look it up in the texture!\n  if ( all(greaterThanEqual(dataCoordinates, ivec3(0))) &&\n       all(lessThan(dataCoordinates, uDataDimensions))) {\n    vec4 packedValue = texture3DPolyfill(\n        dataCoordinates,\n        uDataDimensions,\n        uTextureSize,\n        uTextureContainer[0],\n        uTextureContainer[1],\n        uTextureContainer[2],\n        uTextureContainer[3],\n        uTextureContainer[4],\n        uTextureContainer[5],\n        uTextureContainer[6],\n        uTextureContainer     // not working on Moto X 2014\n        );\n\n    vec4 dataValue = unpack(packedValue, uBitsAllocated, 0, uNumberOfChannels);\n\n    // how do we deal wil more than 1 channel?\n    if(uNumberOfChannels == 1){\n      float intensity = dataValue.r;\n\n      // rescale/slope\n      intensity = intensity*uRescaleSlopeIntercept[0] + uRescaleSlopeIntercept[1];\n\n      // window level\n      float windowMin = uWindowCenterWidth[0] - uWindowCenterWidth[1] * 0.5;\n      float windowMax = uWindowCenterWidth[0] + uWindowCenterWidth[1] * 0.5;\n      intensity = ( intensity - windowMin ) / uWindowCenterWidth[1];\n\n      dataValue.r = dataValue.g = dataValue.b = intensity;\n    }\n\n    // Apply LUT table...\n    //\n    if(uLut == 1){\n      // should opacity be grabbed there?\n      dataValue = texture2D( uTextureLUT, vec2( dataValue.r , 1.0) );\n    }\n\n    if(uInvert == 1){\n      dataValue = vec4(1.) - dataValue;\n      // how do we deal with that and opacity?\n      dataValue.a = 1.;\n    }\n\n    gl_FragColor = dataValue;\n\n  }\n  else{\n    // should be able to choose what we want to do if not in range:\n    // discard or specific color\n    // discard;\n    gl_FragColor = vec4(0.011, 0.662, 0.956, 1.0);\n  }\n}"
        });
      }

      // update intensity related stuff
      this.updateIntensitySettings();
      this.updateIntensitySettingsUniforms();

      // create the mesh!
      this._mesh = new THREE.Mesh(this._geometry, this._material);
      if (this._aaBBspace === 'IJK') {
        this._mesh.applyMatrix(this._stack.ijk2LPS);
      }

      this._mesh.visible = this._visible;

      // and add it!
      this.add(this._mesh);
    }
  }, {
    key: 'updateIntensitySettings',
    value: function updateIntensitySettings() {
      // if auto, get from frame index
      if (this._intensityAuto) {
        this.updateIntensitySetting('windowCenter');
        this.updateIntensitySetting('windowWidth');
        this.updateIntensitySetting('rescaleSlope');
        this.updateIntensitySetting('rescaleIntercept');
      } else {
        if (this._windowCenter === null) {
          this._windowCenter = this._stack.windowCenter;
        }

        if (this.__windowWidth === null) {
          this._windowWidth = this._stack.windowWidth;
        }

        if (this._rescaleSlope === null) {
          this._rescaleSlope = this._stack.rescaleSlope;
        }

        if (this._rescaleIntercept === null) {
          this._rescaleIntercept = this._stack.rescaleIntercept;
        }
      }
    }
  }, {
    key: 'updateIntensitySettingsUniforms',
    value: function updateIntensitySettingsUniforms() {
      // set slice window center and width
      this._uniforms.uRescaleSlopeIntercept.value = [this._rescaleSlope, this._rescaleIntercept];
      this._uniforms.uWindowCenterWidth.value = [this._windowCenter, this._windowWidth];

      // invert
      this._uniforms.uInvert.value = this._invert === true ? 1 : 0;

      // lut
      if (this._lut === 'none') {
        this._uniforms.uLut.value = 0;
      } else {
        this._uniforms.uLut.value = 1;
        this._uniforms.uTextureLUT.value = this._lutTexture;
      }
    }
  }, {
    key: 'updateIntensitySetting',
    value: function updateIntensitySetting(setting) {
      if (this._stack.frame[this._index] && this._stack.frame[this._index][setting]) {
        this['_' + setting] = this._stack.frame[this._index][setting];
      } else {
        this['_' + setting] = this._stack[setting];
      }
    }
  }, {
    key: '_update',
    value: function _update() {
      // update slice
      if (this._mesh) {
        this.remove(this._mesh);
        this._mesh.geometry.dispose();
        this._mesh.geometry = null;
        // we do not want to dispose the texture!
        // this._mesh.material.dispose();
        // this._mesh.material = null;
        this._mesh = null;
      }

      this._create();
    }
  }, {
    key: 'stack',
    get: function get() {
      return this._stack;
    },
    set: function set(stack) {
      this._stack = stack;
    }
  }, {
    key: 'windowWidth',
    get: function get() {
      return this._windowWidth;
    },
    set: function set(windowWidth) {
      this._windowWidth = windowWidth;
      this.updateIntensitySettingsUniforms();
    }
  }, {
    key: 'windowCenter',
    get: function get() {
      return this._windowCenter;
    },
    set: function set(windowCenter) {
      this._windowCenter = windowCenter;
      this.updateIntensitySettingsUniforms();
    }
  }, {
    key: 'rescaleSlope',
    get: function get() {
      return this._rescaleSlope;
    },
    set: function set(rescaleSlope) {
      this._rescaleSlope = rescaleSlope;
      this.updateIntensitySettingsUniforms();
    }
  }, {
    key: 'rescaleIntercept',
    get: function get() {
      return this._rescaleIntercept;
    },
    set: function set(rescaleIntercept) {
      this._rescaleIntercept = rescaleIntercept;
      this.updateIntensitySettingsUniforms();
    }
  }, {
    key: 'invert',
    get: function get() {
      return this._invert;
    },
    set: function set(invert) {
      this._invert = invert;
      this.updateIntensitySettingsUniforms();
    }
  }, {
    key: 'lut',
    get: function get() {
      return this._lut;
    },
    set: function set(lut) {
      this._lut = lut;
    }
  }, {
    key: 'lutTexture',
    get: function get() {
      return this._lutTexture;
    },
    set: function set(lutTexture) {
      this._lutTexture = lutTexture;
      this.updateIntensitySettingsUniforms();
    }
  }, {
    key: 'intensityAuto',
    get: function get() {
      return this._intensityAuto;
    },
    set: function set(intensityAuto) {
      this._intensityAuto = intensityAuto;
      this.updateIntensitySettings();
      this.updateIntensitySettingsUniforms();
    }
  }, {
    key: 'index',
    get: function get() {
      return this._index;
    },
    set: function set(index) {
      this._index = index;
      this._update();
    }
  }, {
    key: 'planePosition',
    set: function set(position) {
      this._planePosition = position;
      this._update();
    },
    get: function get() {
      return this._planePosition;
    }
  }, {
    key: 'planeDirection',
    set: function set(direction) {
      this._planeDirection = direction;
      this._update();
    },
    get: function get() {
      return this._planeDirection;
    }
  }, {
    key: 'halfDimensions',
    set: function set(halfDimensions) {
      this._halfDimensions = halfDimensions;
    },
    get: function get() {
      return this._halfDimensions;
    }
  }, {
    key: 'center',
    set: function set(center) {
      this._center = center;
    },
    get: function get() {
      return this._center;
    }
  }, {
    key: 'aabbSpace',
    set: function set(aabbSpace) {
      this._aaBBspace = aabbSpace;
      this._init();
    },
    get: function get() {
      return this._aaBBspace;
    }
  }, {
    key: 'mesh',
    set: function set(mesh) {
      this._mesh = mesh;
    },
    get: function get() {
      return this._mesh;
    }
  }, {
    key: 'geometry',
    set: function set(geometry) {
      this._geometry = geometry;
    },
    get: function get() {
      return this._geometry;
    }
  }]);

  return HelpersSlice;
}(THREE.Object3D);

exports.default = HelpersSlice;

},{"../../src/geometries/geometries.slice":20,"../../src/shaders/shaders.data":40}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('../../src/helpers/helpers.boundingbox');

var _helpers2 = _interopRequireDefault(_helpers);

var _helpers3 = require('../../src/helpers/helpers.slice');

var _helpers4 = _interopRequireDefault(_helpers3);

var _helpers5 = require('../../src/helpers/helpers.border');

var _helpers6 = _interopRequireDefault(_helpers5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*** Imports ***/


var HelpersStack = function (_THREE$Object3D) {
  _inherits(HelpersStack, _THREE$Object3D);

  function HelpersStack(stack) {
    _classCallCheck(this, HelpersStack);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HelpersStack).call(this));
    //


    _this._stack = stack;
    _this._bBox = null;
    _this._slice = null;
    _this._border = null;
    _this._dummy = null;

    _this._orientation = 0;
    _this._index = 0;

    _this._uniforms = null;
    _this._autoWindowLevel = false;
    _this._outOfBounds = false;

    // this._arrow = {
    //   visible: true,
    //   color: 0xFFF336,
    //   length: 20,
    //   material: null,
    //   geometry: null,
    //   mesh: null
    // };
    _this._create();
    return _this;
  }

  _createClass(HelpersStack, [{
    key: '_create',
    value: function _create() {
      if (this._stack) {

        // prepare sthe stack internals
        this._prepareStack();

        // prepare visual objects
        this._prepareBBox();
        this._prepareSlice();
        this._prepareBorder();
        // todo: Arrow
      } else {
          window.console.log('no stack to be prepared...');
        }
    }
  }, {
    key: '_isIndexOutOfBounds',
    value: function _isIndexOutOfBounds() {

      var dimensionsIJK = this._stack.dimensionsIJK;
      var dimensions = 0;
      switch (this._orientation) {
        case 0:
          dimensions = dimensionsIJK.z;
          break;
        case 1:
          dimensions = dimensionsIJK.x;
          break;
        case 2:
          dimensions = dimensionsIJK.y;
          break;
        default:
          // do nothing!
          break;
      }

      if (this._index >= dimensions) {
        this._outOfBounds = true;
      } else {
        this._outOfBounds = false;
      }
    }
  }, {
    key: '_prepareStack',
    value: function _prepareStack() {
      // make sure there is something, if not throw an error
      if (!this._stack.prepared) {
        this._stack.prepare();
      }

      if (!this._stack.packed) {
        this._stack.pack();
      }
    }
  }, {
    key: '_prepareBBox',
    value: function _prepareBBox() {
      this._bBox = new _helpers2.default(this._stack);
      this.add(this._bBox);
    }
  }, {
    key: '_prepareBorder',
    value: function _prepareBorder() {
      this._border = new _helpers6.default(this._slice);
      this.add(this._border);
    }

    //

  }, {
    key: '_prepareSlice',
    value: function _prepareSlice() {
      var halfDimensionsIJK = this._stack.halfDimensionsIJK;
      this._index = this._prepareSliceIndex(halfDimensionsIJK);
      var position = this._prepareSlicePosition(halfDimensionsIJK, this._index);
      var direction = this._prepareDirection(this._orientation);

      this._slice = new _helpers4.default(this._stack, this._index, position, direction);
      this.add(this._slice);
    }
  }, {
    key: '_prepareSliceIndex',
    value: function _prepareSliceIndex(halfDimensions) {
      var index = 0;
      switch (this._orientation) {
        case 0:
          index = Math.floor(halfDimensions.z);
          break;
        case 1:
          index = Math.floor(halfDimensions.x);
          break;
        case 2:
          index = Math.floor(halfDimensions.y);
          break;
        default:
          // do nothing!
          break;
      }
      return index;
    }
  }, {
    key: '_prepareSlicePosition',
    value: function _prepareSlicePosition(halfDimensions, index) {
      var position = new THREE.Vector3(0, 0, 0);
      switch (this._orientation) {
        case 0:
          position = new THREE.Vector3(Math.floor(halfDimensions.x), Math.floor(halfDimensions.y), index);
          break;
        case 1:
          position = new THREE.Vector3(index, Math.floor(halfDimensions.y), Math.floor(halfDimensions.z));
          break;
        case 2:
          position = new THREE.Vector3(Math.floor(halfDimensions.x), index, Math.floor(halfDimensions.z));
          break;
        default:
          // do nothing!
          break;
      }
      return position;
    }
  }, {
    key: '_prepareDirection',
    value: function _prepareDirection(orientation) {
      var direction = new THREE.Vector3(0, 0, 1);
      switch (orientation) {
        case 0:
          direction = new THREE.Vector3(0, 0, 1);
          break;
        case 1:
          direction = new THREE.Vector3(1, 0, 0);
          break;
        case 2:
          direction = new THREE.Vector3(0, 1, 0);
          break;
        default:
          // do nothing!
          break;
      }

      return direction;
    }
  }, {
    key: 'stack',
    get: function get() {
      return this._stack;
    }
  }, {
    key: 'bbox',
    get: function get() {
      return this._bBox;
    }
  }, {
    key: 'slice',
    get: function get() {
      return this._slice;
    }
  }, {
    key: 'border',
    get: function get() {
      return this._border;
    }
  }, {
    key: 'index',
    get: function get() {
      return this._index;
    },
    set: function set(index) {

      this._index = index;

      // update the slice
      this._slice.index = index;
      var halfDimensions = this._stack.halfDimensionsIJK;
      this._slice.planePosition = this._prepareSlicePosition(halfDimensions, this._index);

      // also update the border
      this._border.helpersSlice = this._slice;

      // update ourOfBounds flag
      this._isIndexOutOfBounds();
    }
  }, {
    key: 'orientation',
    set: function set(orientation) {
      this._orientation = orientation;
      this._slice.planeDirection = this._prepareDirection(this._orientation);

      // also update the border
      this._border.helpersSlice = this._slice;
    },
    get: function get() {
      return this._orientation;
    }
  }, {
    key: 'outOfBounds',
    set: function set(outOfBounds) {
      this._outOfBounds = outOfBounds;
    },
    get: function get() {
      return this._outOfBounds;
    }
  }]);

  return HelpersStack;
}(THREE.Object3D);

exports.default = HelpersStack;

},{"../../src/helpers/helpers.border":22,"../../src/helpers/helpers.boundingbox":23,"../../src/helpers/helpers.slice":26}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../../src/models/models.stack');

var _models2 = _interopRequireDefault(_models);

var _models3 = require('../../src/models/models.voxel');

var _models4 = _interopRequireDefault(_models3);

var _geometries = require('../../src/geometries/geometries.voxel');

var _geometries2 = _interopRequireDefault(_geometries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HelpersVoxel = function (_THREE$Object3D) {
  _inherits(HelpersVoxel, _THREE$Object3D);

  function HelpersVoxel() {
    var worldCoordinates = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var stack = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, HelpersVoxel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HelpersVoxel).call(this));

    _this._stack = stack;
    _this._worldCoordinates = worldCoordinates;

    _this._voxel = new _models4.default();
    _this._voxel.id = _this.id;
    _this._voxel.worldCoordinates = _this._worldCoordinates;

    // if stack provided, compute IJK and value
    if (_this._stack && _this._stack.prepared && _this._worldCoordinates) {
      _this.updateVoxel(_this._worldCoordinates);
    }

    // part of the helper...?
    _this._mesh = null;
    _this._geometry = null;
    _this._material = null;
    // 3 next purpose is just to change the color: at widget level
    _this._selected = false;
    _this._active = false;
    _this._hover = false;
    _this._distance = null;

    _this._showVoxel = true;
    _this._showDomSVG = true;
    _this._showDomMeasurements = true;
    _this._color = '0x00B0FF';
    // just visualization
    // this._svgPointer = '<svg width="40" height="40" \
    //      viewBox="0 0 140 140" version="1.1" \
    //      xmlns="http://www.w3.org/2000/svg"> \
    //   \
    //     <polyline points="10,70 \
    //                       70,10 \
    //                       130,70" />\
    //   \
    //   </svg>';
    /*jshint multistr: true */
    _this._svgPointer = '<svg width="40" height="40" \
                      viewBox="0 0 140 140" version="1.1" \
                      xmlns="http://www.w3.org/2000/svg"> \
                      \
                      <path d="M70,70 \
                               L30,30 \
                               A10,10 0 1 1 10,10\
                               A10,10 0 1 1 30,30" />\
                      \
                      </svg>';

    _this.createMesh();
    return _this;
  }

  _createClass(HelpersVoxel, [{
    key: 'updateVoxel',
    value: function updateVoxel(worldCoordinates) {
      // update world coordinates
      this._voxel.worldCoordinates = worldCoordinates;

      // update data coordinates
      this._voxel.dataCoordinates = _models2.default.worldToData(this._stack, this._voxel.worldCoordinates);

      // update value
      var value = _models2.default.value(this._stack, this._voxel.dataCoordinates);

      this._voxel.value = _models2.default.valueRescaleSlopeIntercept(value, this._stack.rescaleSlope, this._stack.rescaleIntercept);
    }
  }, {
    key: 'updateVoxelScreenCoordinates',
    value: function updateVoxelScreenCoordinates(camera, container) {
      this._voxel.screenCoordinates = HelpersVoxel.worldToScreen(this._worldCoordinates, camera, container);
    }
  }, {
    key: 'createMesh',
    value: function createMesh() {

      var dataCoordinates = _models2.default.worldToData(this._stack, this._worldCoordinates);

      this._geometry = new _geometries2.default(dataCoordinates);
      this._material = new THREE.MeshBasicMaterial({
        wireframe: true,
        wireframeLinewidth: 2
      });
      this._material.color.setHex(this._color);
      this._mesh = new THREE.Mesh(this._geometry, this._material);
      this._mesh.applyMatrix(this._stack.ijk2LPS);

      this._mesh.visible = this._showVoxel;

      this.add(this._mesh);
    }
  }, {
    key: 'createDom',
    value: function createDom() {
      // that could be a web-component!
      var measurementsContainer = this._createDiv('VJSVoxelMeasurements', this.id, 'VJSVoxelMeasurements');
      // RAS
      var rasContainer = this._createDiv('VJSVoxelProbeWorld', this.id, 'VJSVoxelProbeWorld');
      measurementsContainer.appendChild(rasContainer);
      // IJK
      var ijkContainer = this._createDiv('VJSVoxelProbeData', this.id, 'VJSVoxelProbeData');
      measurementsContainer.appendChild(ijkContainer);
      // Value
      var valueContainer = this._createDiv('VJSVoxelProbeValue', this.id, 'VJSVoxelProbeValue');
      measurementsContainer.appendChild(valueContainer);

      // SVG
      var svgContainer = this._createDiv('VJSVoxelProbeSVG', this.id, 'VJSVoxelProbeSVG');
      svgContainer.innerHTML = this._svgPointer;

      // Package everything
      var domElement = this._createDiv('VJSWidgetVoxelProbe', this.id, 'VJSWidgetVoxelProbe');
      domElement.appendChild(svgContainer);
      domElement.appendChild(measurementsContainer);

      return domElement;
    }
  }, {
    key: 'updateDom',
    value: function updateDom(container) {

      if (document.getElementById('VJSVoxelProbeWorld' + this.id) === null) {
        container.appendChild(this.createDom());
      }

      // update content
      var rasContainer = document.getElementById('VJSVoxelProbeWorld' + this.id);
      var rasContent = this._voxel.worldCoordinates.x.toFixed(2) + ' : ' + this._voxel.worldCoordinates.y.toFixed(2) + ' : ' + this._voxel.worldCoordinates.z.toFixed(2);
      rasContainer.innerHTML = 'RAS: ' + rasContent;

      var ijkContainer = document.getElementById('VJSVoxelProbeData' + this.id);
      var ijkContent = this._voxel.dataCoordinates.x + ' : ' + this._voxel.dataCoordinates.y + ' : ' + this._voxel.dataCoordinates.z;
      ijkContainer.innerHTML = 'IJK: ' + ijkContent;

      var valueContainer = document.getElementById('VJSVoxelProbeValue' + this.id);
      var valueContent = this._voxel.value;
      valueContainer.innerHTML = 'Value: ' + valueContent;

      // update div position
      var selectedElement = document.getElementById('VJSWidgetVoxelProbe' + this.id);
      selectedElement.style.top = this._voxel.screenCoordinates.y;
      selectedElement.style.left = this._voxel.screenCoordinates.x;
      // window.console.log(this._voxel);
      // selectedElement.style['transform-origin'] = 'top left';
      // selectedElement.style['transform'] = 'translate(' + this._voxel.screenCoordinates.x + 'px, ' + this._voxel.screenCoordinates.y + 'px)';

      this.updateDomClass(selectedElement);
    }
  }, {
    key: 'updateDomClass',
    value: function updateDomClass() {
      var element = document.getElementById('VJSWidgetVoxelProbe' + this.id);
      if (this._active === true) {
        element.classList.add('VJSVoxelProbeActive');
      } else {
        element.classList.remove('VJSVoxelProbeActive');
      }

      if (this._hover === true) {
        element.classList.add('VJSVoxelProbeHover');
      } else {
        element.classList.remove('VJSVoxelProbeHover');
      }

      if (this._selected === true) {
        element.classList.add('VJSVoxelProbeSelect');
      } else {
        element.classList.remove('VJSVoxelProbeSelect');
      }

      this.updateDomElementDisplay('VJSVoxelMeasurements' + this.id, this._showDomMeasurements);
      this.updateDomElementDisplay('VJSVoxelProbeSVG' + this.id, this._showDomSVG);
    }
  }, {
    key: 'updateDomElementDisplay',
    value: function updateDomElementDisplay(id, show) {
      if (show) {
        document.getElementById(id).style.display = 'block';
      } else {
        document.getElementById(id).style.display = 'none';
      }
    }
  }, {
    key: 'removeTest',
    value: function removeTest() {
      // remove voxelDom
      var node = document.getElementById('VJSWidgetVoxelProbe' + this.id);
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }

      // remove voxelMesh
      this.remove(this._mesh);
      this._mesh.geometry.dispose();
      this._mesh.material.dispose();
      this._mesh = null;
    }
  }, {
    key: '_createDiv',
    value: function _createDiv(idPrefix, idSuffix, className) {
      var divContainer = document.createElement('div');
      divContainer.setAttribute('id', idPrefix + idSuffix);
      divContainer.setAttribute('class', className);

      return divContainer;
    }
  }, {
    key: 'color',
    set: function set(color) {
      this._color = color;
      if (this._material) {
        this._material.color.setHex(this._color);
      }

      // also update the dom
      var selectedElement = document.getElementById('VJSVoxelMeasurements' + this.id);
      if (selectedElement) {
        selectedElement.style.borderColor = this._color.replace('0x', '#');
      }

      selectedElement = document.querySelector('#VJSVoxelProbeSVG' + this.id + '> svg > path');
      if (selectedElement) {
        selectedElement.style.stroke = this._color.replace('0x', '#');
      }
    },
    get: function get() {
      return this._color;
    }
  }, {
    key: 'worldCoordinates',
    set: function set(worldCoordinates) {
      this._worldCoordinates = worldCoordinates;
      this._voxel._worldCoordinates = worldCoordinates;

      // set data coordinates && value
      this.updateVoxel(this._worldCoordinates);

      if (this._mesh && this._mesh.geometry) {
        this._mesh.geometry.location = this._voxel.dataCoordinates;
      }
    },
    get: function get() {
      return this._worldCoordinates;
    }
  }, {
    key: 'voxel',
    get: function get() {
      return this._voxel;
    },
    set: function set(voxel) {
      this._voxel = voxel;
    }
  }, {
    key: 'showVoxel',
    set: function set(showVoxel) {
      this._showVoxel = showVoxel;

      if (this._mesh) {
        this._mesh.visible = this._showVoxel;
      }
    },
    get: function get() {
      return this._showVoxel;
    }
  }, {
    key: 'showDomSVG',
    set: function set(showDomSVG) {
      this._showDomSVG = showDomSVG;
      this.updateDomClass();
    },
    get: function get() {
      return this._showDomSVG;
    }
  }, {
    key: 'showDomMeasurements',
    set: function set(showDomMeasurements) {
      this._showDomMeasurements = showDomMeasurements;
      this.updateDomClass();
    },
    get: function get() {
      return this._showDomMeasurements;
    }
  }, {
    key: 'distance',
    set: function set(distance) {
      this._distance = distance;
    },
    get: function get() {
      return this._distance;
    }
  }, {
    key: 'selected',
    set: function set(selected) {
      this._selected = selected;
    },
    get: function get() {
      return this._selected;
    }
  }, {
    key: 'hover',
    set: function set(hover) {
      this._hover = hover;
    },
    get: function get() {
      return this._hover;
    }
  }, {
    key: 'active',
    set: function set(active) {
      this._active = active;
    },
    get: function get() {
      return this._active;
    }
  }], [{
    key: 'worldToScreen',
    value: function worldToScreen(worldCoordinate, camera, canvas) {
      var screenCoordinates = worldCoordinate.clone();
      screenCoordinates.project(camera);

      screenCoordinates.x = Math.round((screenCoordinates.x + 1) * canvas.offsetWidth / 2);
      screenCoordinates.y = Math.round((-screenCoordinates.y + 1) * canvas.offsetHeight / 2);
      screenCoordinates.z = 0;

      return screenCoordinates;
    }
  }]);

  return HelpersVoxel;
}(THREE.Object3D);

exports.default = HelpersVoxel;

},{"../../src/geometries/geometries.voxel":21,"../../src/models/models.stack":34,"../../src/models/models.voxel":35}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // PARSERS


// MODELS


var _parsers = require('../../src/parsers/parsers.dicom');

var _parsers2 = _interopRequireDefault(_parsers);

var _models = require('../../src/models/models.series');

var _models2 = _interopRequireDefault(_models);

var _models3 = require('../../src/models/models.stack');

var _models4 = _interopRequireDefault(_models3);

var _models5 = require('../../src/models/models.frame');

var _models6 = _interopRequireDefault(_models5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * It is typically used to load a DICOM image. Use loading manager for
 * advanced usage, such as multiple files handling.
 *
 * Demo: {@link https://fnndsc.github.io/vjs#loader_dicom}
 *
 * @constructor
 * @class
 * @memberOf VJS.loaders
 * @public
 *
 * @example
 * var files = ['/data/dcm/fruit'];
 *
 * // Instantiate a dicom loader
 * var lDicomoader = new dicom();
 *
 * // load a resource
 * loader.load(
 *   // resource URL
 *   files[0],
 *   // Function when resource is loaded
 *   function(object) {
 *     //scene.add( object );
 *     window.console.log(object);
 *   }
 * );
 */

var LoadersDicom = function () {
  function LoadersDicom() {
    _classCallCheck(this, LoadersDicom);

    this._loaded = -1;
    this._totalLoaded = -1;
    this._parsed = -1;
    this._totalParsed = -1;
  }

  _createClass(LoadersDicom, [{
    key: 'progress',
    value: function progress() {
      var _this = this;

      requestAnimationFrame(function () {
        var message = '';
        var progress = 0;
        var color = '#CDDC39';
        if (_this._parsed >= 0) {
          message = 'parsing ';
          color = '#E91E63';
          progress = Math.round(_this._parsed / _this._totalParsed * 100);
        }
        // downloading the files
        else {
            message = 'downloading ';
            color = '#FFF56F';
            progress = Math.round(_this._loaded / _this._totalLoaded * 100);
          }

        var loaderElement = document.getElementById('loader');
        if (loaderElement) {
          loaderElement.style.borderColor = color;
          loaderElement.style.width = progress + '%';
        }
        // to avoid memory leaking
        loaderElement = null;
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(url) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.crossOrigin = true;
        request.responseType = 'arraybuffer';

        request.onload = function (event) {
          if (request.status === 200) {
            _this2._loaded = event.loaded;
            _this2._totalLoaded = event.total;
            _this2.progress();

            resolve(request.response);
          } else {
            reject(request.statusText);
          }
        };
        request.onerror = function () {
          reject(request.statusText);
        };

        request.onprogress = function (event) {
          _this2._loaded = event.loaded;
          _this2._totalLoaded = event.total;
          _this2.progress();
        };

        request.send();
      });
    }
  }, {
    key: 'parseFrame',
    value: function parseFrame(series, stack, i, dataParser, resolve, reject) {
      var frame = new _models6.default();
      frame.sopInstanceUID = dataParser.sopInstanceUID(i);
      frame.rows = dataParser.rows(i);
      frame.columns = dataParser.columns(i);
      frame.numberOfChannels = stack.numberOfChannels;
      frame.pixelData = dataParser.extractPixelData(i);
      frame.pixelSpacing = dataParser.pixelSpacing(i);
      frame.sliceThickness = dataParser.sliceThickness(i);
      frame.imageOrientation = dataParser.imageOrientation(i);
      if (frame.imageOrientation === null) {
        frame.imageOrientation = [1, 0, 0, 0, 1, 0];
      }
      frame.imagePosition = dataParser.imagePosition(i);
      if (frame.imagePosition === null) {
        frame.imagePosition = [0, 0, i];
      }
      frame.dimensionIndexValues = dataParser.dimensionIndexValues(i);
      frame.bitsAllocated = dataParser.bitsAllocated(i);
      frame.instanceNumber = dataParser.instanceNumber(i);
      frame.windowCenter = dataParser.windowCenter(i);
      frame.windowWidth = dataParser.windowWidth(i);
      frame.rescaleSlope = dataParser.rescaleSlope(i);
      frame.rescaleIntercept = dataParser.rescaleIntercept(i);
      // should pass frame index for consistency...
      frame.minMax = dataParser.minMaxPixelData(frame.pixelData);

      stack.frame.push(frame);

      // update status
      this._parsed = i + 1;
      this._totalParsed = series.numberOfFrames;
      this.progress();

      if (this._parsed === this._totalParsed) {
        resolve(series);
      } else {
        setTimeout(this.parseFrame(series, stack, this._parsed, dataParser, resolve, reject), 0);
      }
    }
  }, {
    key: 'parse',
    value: function parse(response) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var dicomParser = null;
        try {
          dicomParser = new _parsers2.default(response, 0);
        } catch (e) {
          window.console.log(e);
          reject(e);
        }

        // create a series
        var series = new _models2.default();
        series.seriesInstanceUID = dicomParser.seriesInstanceUID();
        series.numberOfFrames = dicomParser.numberOfFrames();
        if (!series.numberOfFrames) {
          series.numberOfFrames = 1;
        }
        series.numberOfChannels = dicomParser.numberOfChannels();

        // just create 1 dummy stack for now
        var stack = new _models4.default();
        stack.numberOfChannels = dicomParser.numberOfChannels();

        series.stack.push(stack);
        // recursive call for each frame
        // better than for loop to be able to update dom with "progress" callback
        setTimeout(_this3.parseFrame(series, stack, 0, dicomParser, resolve, reject), 0);
      });
    }
  }]);

  return LoadersDicom;
}();

exports.default = LoadersDicom;

},{"../../src/models/models.frame":31,"../../src/models/models.series":33,"../../src/models/models.stack":34,"../../src/parsers/parsers.dicom":38}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loaders = require('./loaders.dicom');

var _loaders2 = _interopRequireDefault(_loaders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Dicom: _loaders2.default
};

},{"./loaders.dicom":29}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelsFrame = function () {
  function ModelsFrame() {
    _classCallCheck(this, ModelsFrame);

    this._id = -1;
    this._sopInstanceUID = null;
    this._stackID = -1;
    this._rows = 0;
    this._columns = 0;
    this._dimensionIndexValues = [];
    this._imagePosition = null;
    this._imageOrientation = null;
    this._sliceThickness = 1;
    this._spacingBetweenSlices = null;
    this._pixelSpacing = null;
    this._pixelAspectRatio = null;
    this._pixelData = null;

    this._instanceNumber = null;
    this._windowCenter = null;
    this._windowWidth = null;
    this._rescaleSlope = null;
    this._rescaleIntercept = null;

    this._bitsAllocated = 8;

    this._minMax = null;
    this._dist = null;
  }

  _createClass(ModelsFrame, [{
    key: "rows",
    get: function get() {
      return this._rows;
    },
    set: function set(rows) {
      this._rows = rows;
    }
  }, {
    key: "columns",
    get: function get() {
      return this._columns;
    },
    set: function set(columns) {
      this._columns = columns;
    }
  }, {
    key: "spacingBetweenSlices",
    get: function get() {
      return this._spacingBetweenSlices;
    },
    set: function set(spacingBetweenSlices) {
      this._spacingBetweenSlices = spacingBetweenSlices;
    }
  }, {
    key: "sliceThickness",
    get: function get() {
      return this._sliceThickness;
    },
    set: function set(sliceThickness) {
      this._sliceThickness = sliceThickness;
    }
  }, {
    key: "imagePosition",
    get: function get() {
      return this._imagePosition;
    },
    set: function set(imagePosition) {
      this._imagePosition = imagePosition;
    }
  }, {
    key: "imageOrientation",
    get: function get() {
      return this._imageOrientation;
    },
    set: function set(imageOrientation) {
      this._imageOrientation = imageOrientation;
    }
  }, {
    key: "windowWidth",
    get: function get() {
      return this._windowWidth;
    },
    set: function set(windowWidth) {
      this._windowWidth = windowWidth;
    }
  }, {
    key: "windowCenter",
    get: function get() {
      return this._windowCenter;
    },
    set: function set(windowCenter) {
      this._windowCenter = windowCenter;
    }
  }, {
    key: "rescaleSlope",
    get: function get() {
      return this._rescaleSlope;
    },
    set: function set(rescaleSlope) {
      this._rescaleSlope = rescaleSlope;
    }
  }, {
    key: "rescaleIntercept",
    get: function get() {
      return this._rescaleIntercept;
    },
    set: function set(rescaleIntercept) {
      this._rescaleIntercept = rescaleIntercept;
    }
  }, {
    key: "bitsAllocated",
    get: function get() {
      return this._bitsAllocated;
    },
    set: function set(bitsAllocated) {
      this._bitsAllocated = bitsAllocated;
    }
  }, {
    key: "dist",
    get: function get() {
      return this._dist;
    },
    set: function set(dist) {
      this._dist = dist;
    }
  }, {
    key: "pixelSpacing",
    get: function get() {
      return this._pixelSpacing;
    },
    set: function set(pixelSpacing) {
      this._pixelSpacing = pixelSpacing;
    }
  }, {
    key: "pixelAspectRatio",
    get: function get() {
      return this._pixelAspectRatio;
    },
    set: function set(pixelAspectRatio) {
      this._pixelAspectRatio = pixelAspectRatio;
    }
  }, {
    key: "minMax",
    get: function get() {
      return this._minMax;
    },
    set: function set(minMax) {
      this._minMax = minMax;
    }
  }, {
    key: "dimensionIndexValues",
    get: function get() {
      return this._dimensionIndexValues;
    },
    set: function set(dimensionIndexValues) {
      this._dimensionIndexValues = dimensionIndexValues;
    }
  }, {
    key: "instanceNumber",
    get: function get() {
      return this._instanceNumber;
    },
    set: function set(instanceNumber) {
      this._instanceNumber = instanceNumber;
    }
  }, {
    key: "pixelData",
    get: function get() {
      return this._pixelData;
    },
    set: function set(pixelData) {
      this._pixelData = pixelData;
    }
  }, {
    key: "sopInstanceUID",
    set: function set(sopInstanceUID) {
      this._sopInstanceUID = sopInstanceUID;
    },
    get: function get() {
      return this._sopInstanceUID;
    }
  }], [{
    key: "value",
    value: function value(frame, column, row) {
      return frame.pixelData[column + frame._columns * row];
    }
  }]);

  return ModelsFrame;
}();

exports.default = ModelsFrame;

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('./models.frame');

var _models2 = _interopRequireDefault(_models);

var _models3 = require('./models.stack');

var _models4 = _interopRequireDefault(_models3);

var _models5 = require('./models.series');

var _models6 = _interopRequireDefault(_models5);

var _models7 = require('./models.voxel');

var _models8 = _interopRequireDefault(_models7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Frame: _models2.default,
  Stack: _models4.default,
  Series: _models6.default,
  Voxel: _models8.default
};

},{"./models.frame":31,"./models.series":33,"./models.stack":34,"./models.voxel":35}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelsSeries = function () {
  function ModelsSeries() {
    _classCallCheck(this, ModelsSeries);

    this._id = -1;
    this._concatenationUID = -1;
    this._seriesInstanceUID = -1;
    this._seriesNumber = -1;
    this._dimensionIndexSequence = [];

    // should probably not be there
    this._rows = 0;
    this._columns = 0;
    this._photometricInterpretation = '';

    this._numberOfFrames = 0;
    this._numberOfChannels = 1;
    this._instanceNumber = 0;

    this._stack = [];
  }

  _createClass(ModelsSeries, [{
    key: 'merge',
    value: function merge(series) {
      // try to merge seriesHelper with current series.
      // same series if same Series UID?
      // could use concatenation if available, to already know if series is complete!
      var sameSeriesUID = false;
      if (this._seriesInstanceUID === series.seriesInstanceUID) {
        sameSeriesUID = true;

        // Make sure series information is consisent?
        // re-compute it?
        var stack = series.stack;
        // Merge Stacks (N against N)
        // try to match all stack to current stacks, if not add it to stacks list!
        for (var i = 0; i < stack.length; i++) {
          // test stack against existing stack
          for (var j = 0; j < this._stack.length; j++) {
            if (this._stack[j].merge(stack[i])) {
              // merged successfully
              break;
            } else if (j === this._stack.length - 1) {
              // last merge was not successful
              // this is a new stack
              this._stack.push(stack[i]);
            }
          }
        }
      }

      return sameSeriesUID;
    }
  }, {
    key: 'seriesInstanceUID',
    set: function set(seriesInstanceUID) {
      this._seriesInstanceUID = seriesInstanceUID;
    },
    get: function get() {
      return this._seriesInstanceUID;
    }
  }, {
    key: 'numberOfFrames',
    set: function set(numberOfFrames) {
      this._numberOfFrames = numberOfFrames;
    },
    get: function get() {
      return this._numberOfFrames;
    }
  }, {
    key: 'numberOfChannels',
    set: function set(numberOfChannels) {
      this._numberOfChannels = numberOfChannels;
    },
    get: function get() {
      return this._numberOfChannels;
    }
  }, {
    key: 'stack',
    set: function set(stack) {
      this._stack = stack;
    },
    get: function get() {
      return this._stack;
    }
  }]);

  return ModelsSeries;
}();

exports.default = ModelsSeries;

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../../src/models/models.frame');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*** Imports ***/
//var VJS = VJS || {};
//VJS.core = VJS.core || {};
//VJS.core.pack = VJS.core.pack || require('../core/core.pack');

var ModelsStack = function () {
  function ModelsStack() {
    _classCallCheck(this, ModelsStack);

    this._id = '-1';
    this._uid = null;
    this._stackID = -1;

    this._frame = [];
    this._numberOfFrames = 0;

    this._rows = 0;
    this._columns = 0;
    this._spacingBetweenSlices = 0;
    this._sliceThickness = 0;
    this._numberOfChannels = 1;

    // origin of the first slice of the stack!
    this._origin = null;

    this._textureSize = 4096;
    this._nbTextures = 7; // HIGH RES..
    this._rawData = [];

    this._windowLevel = [0, 0];
    this._windowCenter = 0;
    this._windowWidth = 0;

    this._rescaleSlopeIntercept = [1, 0];
    this._rescaleSlope = 1;
    this._rescaleIntercept = 0;

    this._minMax = [65535, -32768];
    this._invert = false;

    // TRANSFORMATION MATRICES

    this._ijk2LPS = null;
    this._lps2IJK = null;

    this._aabb2LPS = null;
    this._lps2AABB = null;

    //
    // IJK dimensions
    this._dimensionsIJK = null;
    this._halfDimensionsIJK = null;
    this._spacing = new THREE.Vector3(1, 1, 1);
    this._origin = null;
    this._xCosine = new THREE.Vector3(1, 0, 0);
    this._yCosine = new THREE.Vector3(0, 1, 0);
    this._zCosine = new THREE.Vector3(0, 0, 1);

    // convenience vars
    this._prepared = false;
    this._packed = false;
  }

  _createClass(ModelsStack, [{
    key: 'prepare',
    value: function prepare() {
      // compute number of frames
      if (this._frame && this._frame.length > 0) {
        this._numberOfFrames = this._frame.length;
      } else {
        window.console.log('_frame doesn\'t contain anything....');
        window.console.log(this._frame);
      }

      // pass parameters from frame to stack
      this._rows = this._frame[0].rows;
      this._columns = this._frame[0].columns;
      this._dimensionsIJK = new THREE.Vector3(this._columns, this._rows, this._numberOfFrames);
      this._spacingBetweenSlices = this._frame[0].spacingBetweenSlices;
      this._sliceThickness = this._frame[0].sliceThickness;

      // compute direction cosines
      this.computeDirectionCosines();

      // order the frames
      this.orderFrames();

      // compute/guess spacing
      this.guessSpacing();

      // set extra vars if nulls
      // happens now because if it hapen before, we would think image position/orientation
      // are defined and we would use it to compute spacing.
      if (!this._frame[0].imagePosition) {
        this._frame[0].imagePosition = [0, 0, 0];
      }

      if (!this._frame[0].imageOrientation) {
        this._frame[0].imageOrientation = [1, 0, 0, 0, 1, 0];
      }

      this.computeMinMaxIntensities();

      this._origin = this._vector3FromArray(this._frame[0].imagePosition, 0);

      // half dimensions are usefu for faster computations of intersection.
      this._halfDimensionsIJK = new THREE.Vector3(this._dimensionsIJK.x / 2, this._dimensionsIJK.y / 2, this._dimensionsIJK.z / 2);

      this.computeIJK2LPS();
      this.computeLPS2AABB();

      this._rescaleSlopeIntercept[0] = this._frame[0].rescaleSlope || 1;
      this._rescaleSlopeIntercept[1] = this._frame[0].rescaleIntercept || 0;
      this._rescaleSlope = this._rescaleSlopeIntercept[0];
      this._rescaleIntercept = this._rescaleSlopeIntercept[1];

      // rescale/slope min max
      this._minMax[0] = ModelsStack.valueRescaleSlopeIntercept(this._minMax[0], this._rescaleSlopeIntercept[0], this._rescaleSlopeIntercept[1]);
      this._minMax[1] = ModelsStack.valueRescaleSlopeIntercept(this._minMax[1], this._rescaleSlopeIntercept[0], this._rescaleSlopeIntercept[1]);

      var width = this._frame[0].windowWidth || this._minMax[1] - this._minMax[0];
      width = this._rescaleSlopeIntercept[0] * width + this._rescaleSlopeIntercept[1];
      var center = this._frame[0].windowCenter || this._minMax[0] + width / 2;
      center = this._rescaleSlopeIntercept[0] * center + this._rescaleSlopeIntercept[1];

      this._windowCenterWidth = [center, width];
      this._windowCenter = this._windowCenterWidth[0];
      this._windowWidth = this._windowCenterWidth[1];

      // need to pass min/max
      this._bitsAllocated = this._frame[0].bitsAllocated;

      this._prepared = true;
    }
  }, {
    key: 'computeDirectionCosines',
    value: function computeDirectionCosines() {
      if (this._frame && this._frame[0] && this._frame[0].imageOrientation && this._frame[0].imageOrientation.length === 6) {

        this._xCosine = this._vector3FromArray(this._frame[0].imageOrientation, 0);
        this._yCosine = this._vector3FromArray(this._frame[0].imageOrientation, 3);
      }

      this._zCosine = new THREE.Vector3(0, 0, 0).crossVectors(this._xCosine, this._yCosine).normalize();
    }
  }, {
    key: 'orderFrames',
    value: function orderFrames() {
      // order the frames based on theirs dimension indices
      // first index is the most important.
      // 1,1,1,1 willl be first
      // 1,1,2,1 will be next
      // 1,1,2,3 will be next
      // 1,1,3,1 wil be next
      if (this._frame[0].dimensionIndexValues) {
        this._frame.sort(this._orderFrameOnDimensionIndicesArraySort);

        // else order with image position and orientation
      } else if (this._frame[0].imagePosition && this._frame[0].imageOrientation && this._frame[1] && this._frame[1].imagePosition && this._frame[1].imageOrientation && this._frame[0].imagePosition.join() !== this._frame[1].imagePosition.join()) {
          // compute and sort by dist in this series
          this._frame.map(this._computeDistanceArrayMap.bind(null, this._zCosine));
          this._frame.sort(this._sortDistanceArraySort);
        } else if (this._frame[0].instanceNumber !== null && this._frame[1] && this._frame[1].instanceNumber !== null && this._frame[0].instanceNumber !== this._frame[1].instanceNumber) {

          this._frame.sort(this._sortInstanceNumberArraySort);
        } else if (this._frame[0].sopInstanceUID && this._frame[1] && this._frame[1].sopInstanceUID && this._frame[0].sopInstanceUID !== this._frame[1].sopInstanceUID) {
          this._frame.sort(this._sortSopInstanceUIDArraySort);
        } else {
          //window.console.log(this._frame[0]);
          //window.console.log(this._frame[1]);
          // window.console.log(this._frame[0].instanceNumber !== null && true);
          //window.console.log(this._frame[0].instanceNumber !== this._frame[1].instanceNumber);
          window.console.log('do not know how to order the frames...');
          // else slice location
          // image number
          // ORDERING BASED ON instance number
          // _ordering = 'instance_number';
          // first_image.sort(function(a,b){return a["instance_number"]-b["instance_number"]});
        }
    }
  }, {
    key: 'guessSpacing',
    value: function guessSpacing() {
      this.xySpacing();
      this.zSpacing();
    }
  }, {
    key: 'zSpacing',
    value: function zSpacing() {

      if (this._numberOfFrames > 1) {
        if (this._spacingBetweenSlices) {
          this._spacing.z = this._spacingBetweenSlices;
          // if pixelSpacing in Z direction is already defined
          // i.e. by nifti parser
        } else if (this._frame[0].pixelSpacing && this._frame[0].pixelSpacing[2]) {
            this._spacing.z = this._frame[0].pixelSpacing[2];
          } else {
            // compute and sort by dist in this series
            this._frame.map(this._computeDistanceArrayMap.bind(null, this._zCosine));
            this._frame.sort(this._sortDistanceArraySort);

            this._spacing.z = this._frame[1].dist - this._frame[0].dist;
          }
        // } else if (this._frame[0].sliceThickness) {
        //   zSpacing = this._frame[0].sliceThickness;
      }

      // Spacing
      // can not be 0 if not matrix can not be inverted.
      if (this._spacing.z === 0) {
        this._spacing.z = 1;
      }
    }
  }, {
    key: 'xySpacing',
    value: function xySpacing() {
      if (this._frame[0].pixelSpacing) {
        // row
        this._spacing.x = this._frame[0].pixelSpacing[0];
        //column
        this._spacing.y = this._frame[0].pixelSpacing[1];
      } else if (this._frame[0].pixelAspectRatio) {
        this._spacing.x = 1.0;
        this._spacing.y = 1.0 * this._frame[0].pixelAspectRatio[1] / this._frame[0].pixelAspectRatio[0];
      } else {
        this._spacing.x = 1.0;
        this._spacing.y = 1.0;
      }
    }
  }, {
    key: 'computeMinMaxIntensities',
    value: function computeMinMaxIntensities() {
      // what about colors!!!!?
      for (var i = 0; i < this._frame.length; i++) {
        // get min/max
        this._minMax[0] = Math.min(this._minMax[0], this._frame[i].minMax[0]);
        this._minMax[1] = Math.max(this._minMax[1], this._frame[i].minMax[1]);
      }
    }
  }, {
    key: 'computeIJK2LPS',
    value: function computeIJK2LPS() {
      this._ijk2LPS = new THREE.Matrix4();
      this._ijk2LPS.set(this._xCosine.x * this._spacing.x, this._yCosine.x * this._spacing.y, this._zCosine.x * this._spacing.z, this._origin.x, this._xCosine.y * this._spacing.x, this._yCosine.y * this._spacing.y, this._zCosine.y * this._spacing.z, this._origin.y, this._xCosine.z * this._spacing.x, this._yCosine.z * this._spacing.y, this._zCosine.z * this._spacing.z, this._origin.z, 0, 0, 0, 1);

      this._lps2IJK = new THREE.Matrix4();
      this._lps2IJK.getInverse(this._ijk2LPS);
    }
  }, {
    key: 'computeLPS2AABB',
    value: function computeLPS2AABB() {
      this._aabb2LPS = new THREE.Matrix4();
      this._aabb2LPS.set(this._xCosine.x, this._yCosine.x, this._zCosine.x, this._origin.x, this._xCosine.y, this._yCosine.y, this._zCosine.y, this._origin.y, this._xCosine.z, this._yCosine.z, this._zCosine.z, this._origin.z, 0, 0, 0, 1);

      this._lps2AABB = new THREE.Matrix4();
      this._lps2AABB.getInverse(this._aabb2LPS);
    }
  }, {
    key: 'merge',
    value: function merge(stack) {

      if (!stack) {
        return;
      }
      // try to merge imageHelper with current image.
      // same image if same Series UID?
      // could use concatenation if available, to already know if image is complete!
      var sameStackID = false;
      if (this._stackID === stack.stackID) {
        sameStackID = true;

        // Make sure image information is consisent?
        // re-compute it?
        var frame = stack.frame;
        // Merge Stacks (N against N)
        // try to match all stack to current stacks, if not add it to stacks list!
        for (var i = 0; i < frame.length; i++) {
          // test stack against existing stack
          for (var j = 0; j < this._frame.length; j++) {
            // test dimension
            // dimension index value not defined!       
            if ( // different indices
            (this._frame[j].dimensionIndexValues && frame[i].dimensionIndexValues && this._frame[j].dimensionIndexValues.join() === frame[i].dimensionIndexValues.join() || this._frame[j].dimensionIndexValues === frame[i].dimensionIndexValues) &&
            // different instance number
            this._frame[j].instanceNumber === frame[i].instanceNumber && (
            // different positions
            this._frame[j].imagePosition && frame[i].imagePosition && this._frame[j].imagePosition.join() === frame[i].imagePosition.join() || this._frame[j].imagePosition === frame[i].imagePosition) && (
            // different orientations
            this._frame[j].imageOrientation && frame[i].imageOrientation && this._frame[j].imageOrientation.join() === frame[i].imageOrientation.join() || this._frame[j].imageOrientation === frame[i].imageOrientation) &&
            // different sopInstanceUIDs
            this._frame[j].sopInstanceUID === frame[i].sopInstanceUID) {

              break;
            } else if (j === this._frame.length - 1) {
              this._frame.push(frame[i]);
              break;
            }
          }
        }
      }

      return sameStackID;
    }
  }, {
    key: 'pack',
    value: function pack() {
      // VJS.core.pack
      // Get total number of voxels
      var nbVoxels = this._dimensionsIJK.x * this._dimensionsIJK.y * this._dimensionsIJK.z;

      // Loop through all the textures we need
      var frameDimension = this._dimensionsIJK.x * this._dimensionsIJK.y;
      var textureDimension = this._textureSize * this._textureSize;
      var requiredTextures = Math.ceil(nbVoxels / textureDimension);
      var voxelIndexStart = 0;
      var voxelIndexStop = this._textureSize * this._textureSize;
      if (voxelIndexStop > nbVoxels) {
        voxelIndexStop = nbVoxels;
      }
      var frameIndex = 0;
      var inFrameIndex = 0;
      var jj = 0;
      var packIndex = 0;

      for (var ii = 0; ii < requiredTextures; ii++) {
        var packedData = null;

        if (this._numberOfChannels === 3) {
          this._textureType = THREE.RGBFormat;
          packedData = new Uint8Array(this._textureSize * this._textureSize * 3);
          packIndex = 0;
          for (jj = voxelIndexStart; jj < voxelIndexStop; jj++) {
            /*jshint bitwise: false*/
            frameIndex = ~ ~(jj / frameDimension);
            inFrameIndex = jj % frameDimension;
            /*jshint bitwise: true*/

            packedData[3 * packIndex] = this._frame[frameIndex].pixelData[3 * inFrameIndex];
            packedData[3 * packIndex + 1] = this._frame[frameIndex].pixelData[3 * inFrameIndex + 1];
            packedData[3 * packIndex + 2] = this._frame[frameIndex].pixelData[3 * inFrameIndex + 2];
            packIndex++;
          }
        } else if (this._numberOfChannels === 1) {
          if (this._frame[0].bitsAllocated === 32) {
            this._textureType = THREE.RGBAFormat;
            packedData = new Uint8Array(this._textureSize * this._textureSize * 4);
            packIndex = 0;
            for (jj = voxelIndexStart; jj < voxelIndexStop; jj++) {
              /*jshint bitwise: false*/
              frameIndex = ~ ~(jj / frameDimension);
              inFrameIndex = jj % frameDimension;
              /*jshint bitwise: true*/

              // slow!
              //let asb = VJS.core.pack.uint16ToAlphaLuminance(this._frame[frameIndex].pixelData[inFrameIndex]);
              var raw = this._frame[frameIndex].pixelData[inFrameIndex];

              /*jshint bitwise: false*/
              var b0 = raw & 0x000000FF;
              var b1 = raw >>> 8 & 0x000000FF;
              var b2 = raw >>> 8 & 0x000000FF;
              var b3 = raw >>> 8 & 0x000000FF;
              // let lsb1 = raw & 0xFF;
              // let msb1 = (raw >> 8) & 0xFF;
              /*jshint bitwise: true*/
              packedData[4 * packIndex] = b0;
              packedData[4 * packIndex + 1] = b1;
              packedData[4 * packIndex + 2] = b2;
              packedData[4 * packIndex + 3] = b3;
              packIndex++;
            }
          } else if (this._frame[0].bitsAllocated === 16) {
            this._textureType = THREE.LuminanceAlphaFormat;
            packedData = new Uint8Array(this._textureSize * this._textureSize * 2);
            packIndex = 0;
            for (jj = voxelIndexStart; jj < voxelIndexStop; jj++) {
              /*jshint bitwise: false*/
              frameIndex = ~ ~(jj / frameDimension);
              inFrameIndex = jj % frameDimension;
              /*jshint bitwise: true*/

              // slow!
              //let asb = VJS.core.pack.uint16ToAlphaLuminance(this._frame[frameIndex].pixelData[inFrameIndex]);
              var raw = this._frame[frameIndex].pixelData[inFrameIndex];

              /*jshint bitwise: false*/
              var lsb = raw & 0x00FF;
              var msb = raw >>> 8 & 0x00FF;
              /*jshint bitwise: true*/
              packedData[2 * packIndex] = lsb;
              packedData[2 * packIndex + 1] = msb;
              packIndex++;
            }

            // } else if(this._frame[0].bitsAllocated === 1){
            //   this._textureType = THREE.LuminanceFormat;
            //   packedData = new Uint8Array(this._textureSize * this._textureSize * 1);
            //   packIndex = 0;

            //   var dataView = new DataView(this._frame[frameIndex].pixelData);
            // // The TextDecoder interface is documented at http://encoding.spec.whatwg.org/#interface-textdecoder
            // var decoder = new TextDecoder();
            // var decodedString = decoder.decode(dataView);
            // window.console.log(decodedString);
            //   for (jj = voxelIndexStart; jj < voxelIndexStop; jj++) {
            //     /*jshint bitwise: false*/
            //     frameIndex = ~~(jj / frameDimension);
            //     inFrameIndex = jj % (frameDimension);
            //     /*jshint bitwise: true*/

            //     packedData[packIndex] = this._frame[frameIndex].pixelData[inFrameIndex];
            //     packIndex++;

            //   }
          } else {
              this._textureType = THREE.LuminanceFormat;
              packedData = new Uint8Array(this._textureSize * this._textureSize * 1);
              packIndex = 0;
              for (jj = voxelIndexStart; jj < voxelIndexStop; jj++) {
                /*jshint bitwise: false*/
                frameIndex = ~ ~(jj / frameDimension);
                inFrameIndex = jj % frameDimension;
                /*jshint bitwise: true*/

                packedData[packIndex] = this._frame[frameIndex].pixelData[inFrameIndex];
                packIndex++;
              }
            }
        } else {
          window.console.log('unsupported number of channels', this._numberOfChannels);
        }

        this._rawData.push(packedData);

        // update voxelIndex
        voxelIndexStart += textureDimension;
        voxelIndexStop += textureDimension;
        if (voxelIndexStop > nbVoxels) {
          voxelIndexStop = nbVoxels;
        }
      }

      this._packed = true;
    }
  }, {
    key: 'worldCenter',
    value: function worldCenter() {
      var center = new THREE.Vector3(this._halfDimensionsIJK.x - 0.5, this._halfDimensionsIJK.y - 0.5, this._halfDimensionsIJK.z - 0.5).applyMatrix4(this._ijk2LPS);

      return center;
    }
  }, {
    key: 'worldBoundingBox',
    value: function worldBoundingBox() {
      var world0 = new THREE.Vector3(0, 0, 0).applyMatrix4(this._ijk2LPS);

      var world1 = new THREE.Vector3(0, this._dimensionsIJK.y - 0.5, 0).applyMatrix4(this._ijk2LPS);

      var world2 = new THREE.Vector3(0, this._dimensionsIJK.y - 0.5, this._dimensionsIJK.z - 0.5).applyMatrix4(this._ijk2LPS);

      var world3 = new THREE.Vector3(0, 0, this._dimensionsIJK.z - 0.5).applyMatrix4(this._ijk2LPS);

      var world4 = new THREE.Vector3(this._dimensionsIJK.x - 0.5, 0, this._dimensionsIJK.z - 0.5).applyMatrix4(this._ijk2LPS);

      var world5 = new THREE.Vector3(this._dimensionsIJK.x - 0.5, this._dimensionsIJK.y - 0.5, 0).applyMatrix4(this._ijk2LPS);

      var world6 = new THREE.Vector3(this._dimensionsIJK.x - 0.5, 0, 0).applyMatrix4(this._ijk2LPS);

      var world7 = new THREE.Vector3(this._dimensionsIJK.x - 0.5, this._dimensionsIJK.y - 0.5, this._dimensionsIJK.z - 0.5).applyMatrix4(this._ijk2LPS);

      var bbox = [Math.min(world0.x, world1.x, world2.x, world3.x, world4.x, world5.x, world6.x, world7.x), Math.max(world0.x, world1.x, world2.x, world3.x, world4.x, world5.x, world6.x, world7.x), // x min/max
      Math.min(world0.y, world1.y, world2.y, world3.y, world4.y, world5.y, world6.y, world7.y), Math.max(world0.y, world1.y, world2.y, world3.y, world4.y, world5.y, world6.y, world7.y), // y min/max
      Math.min(world0.z, world1.z, world2.z, world3.z, world4.z, world5.z, world6.z, world7.z), Math.max(world0.z, world1.z, world2.z, world3.z, world4.z, world5.z, world6.z, world7.z)];

      // z min/max
      return bbox;
    }
  }, {
    key: 'AABBox',
    value: function AABBox() {
      var world0 = new THREE.Vector3(0, 0, 0).applyMatrix4(this._ijk2LPS);
      // to Oriented Axis!
      world0.applyMatrix4(this._lps2AABB);

      var world7 = new THREE.Vector3(this._dimensionsIJK.x - 0.5, this._dimensionsIJK.y - 0.5, this._dimensionsIJK.z - 0.5).applyMatrix4(this._ijk2LPS);
      // to Oriented axis
      world7.applyMatrix4(this._lps2AABB);

      var minBBox = new THREE.Vector3(Math.abs(world0.x - world7.x), Math.abs(world0.y - world7.y), Math.abs(world0.z - world7.z));

      return minBBox;
    }
  }, {
    key: 'centerAABBox',
    value: function centerAABBox() {
      var centerBBox = new THREE.Vector3(this._halfDimensionsIJK.x - 0.5, this._halfDimensionsIJK.y - 0.5, this._halfDimensionsIJK.z - 0.5).applyMatrix4(this._ijk2LPS);

      centerBBox.applyMatrix4(this._lps2AABB);

      return centerBBox;
    }
  }, {
    key: 'worldDims',
    value: function worldDims() {
      // not the data world dimensions
      // max world BBox dimensions
      var world0 = new THREE.Vector3(0, 0, 0).applyMatrix4(this._ijk2LPS);

      var world7 = new THREE.Vector3(this._dimensionsIJK.x - 0.5, this._dimensionsIJK.y - 0.5, this._dimensionsIJK.z - 0.5).applyMatrix4(this._ijk2LPS);

      var dims = new THREE.Vector3(Math.abs(world0.x - world7.x), Math.abs(world0.y - world7.y), Math.abs(world0.z - world7.z));

      return dims;
    }
  }, {
    key: '_vector3FromArray',
    value: function _vector3FromArray(array, index) {
      return new THREE.Vector3(array[index], array[index + 1], array[index + 2]);
    }
  }, {
    key: '_orderFrameOnDimensionIndicesArraySort',
    value: function _orderFrameOnDimensionIndicesArraySort(a, b) {

      if ('dimensionIndexValues' in a && Object.prototype.toString.call(a.dimensionIndexValues) === '[object Array]' && 'dimensionIndexValues' in b && Object.prototype.toString.call(b.dimensionIndexValues) === '[object Array]') {
        for (var i = 0; i < a.dimensionIndexValues.length; i++) {
          if (parseInt(a.dimensionIndexValues[i]) > parseInt(b.dimensionIndexValues[i])) {
            return 1;
          }
          if (parseInt(a.dimensionIndexValues[i]) < parseInt(b.dimensionIndexValues[i])) {
            return -1;
          }
        }
      } else {
        window.console.log('One of the frames doesn\'t have a dimensionIndexValues array.');
        window.console.log(a);
        window.console.log(b);
      }

      return 0;
    }
  }, {
    key: '_computeDistanceArrayMap',
    value: function _computeDistanceArrayMap(normal, frame) {
      frame.dist = frame.imagePosition[0] * normal.x + frame.imagePosition[1] * normal.y + frame.imagePosition[2] * normal.z;
      return frame;
    }
  }, {
    key: '_sortDistanceArraySort',
    value: function _sortDistanceArraySort(a, b) {
      return a.dist - b.dist;
    }
  }, {
    key: '_sortInstanceNumberArraySort',
    value: function _sortInstanceNumberArraySort(a, b) {
      return a.instanceNumber - b.instanceNumber;
    }
  }, {
    key: '_sortSopInstanceUIDArraySort',
    value: function _sortSopInstanceUIDArraySort(a, b) {
      return a.sopInstanceUID - b.sopInstanceUID;
    }
  }, {
    key: 'numberOfChannels',
    set: function set(numberOfChannels) {
      this._numberOfChannels = numberOfChannels;
    },
    get: function get() {
      return this._numberOfChannels;
    }
  }, {
    key: 'frame',
    set: function set(frame) {
      this._frame = frame;
    },
    get: function get() {
      return this._frame;
    }
  }, {
    key: 'prepared',
    set: function set(prepared) {
      this._prepared = prepared;
    },
    get: function get() {
      return this._prepared;
    }
  }, {
    key: 'packed',
    set: function set(packed) {
      this._packed = packed;
    },
    get: function get() {
      return this._packed;
    }
  }, {
    key: 'dimensionsIJK',
    set: function set(dimensionsIJK) {
      this._dimensionsIJK = dimensionsIJK;
    },
    get: function get() {
      return this._dimensionsIJK;
    }
  }, {
    key: 'halfDimensionsIJK',
    set: function set(halfDimensionsIJK) {
      this._halfDimensionsIJK = halfDimensionsIJK;
    },
    get: function get() {
      return this._halfDimensionsIJK;
    }
  }, {
    key: 'ijk2LPS',
    set: function set(ijk2LPS) {
      this._ijk2LPS = ijk2LPS;
    },
    get: function get() {
      return this._ijk2LPS;
    }
  }, {
    key: 'lps2IJK',
    set: function set(lps2IJK) {
      this._lps2IJK = lps2IJK;
    },
    get: function get() {
      return this._lps2IJK;
    }
  }, {
    key: 'lps2AABB',
    set: function set(lps2AABB) {
      this._lps2AABB = lps2AABB;
    },
    get: function get() {
      return this._lps2AABB;
    }
  }, {
    key: 'textureSize',
    set: function set(textureSize) {
      this._textureSize = textureSize;
    },
    get: function get() {
      return this._textureSize;
    }
  }, {
    key: 'textureType',
    set: function set(textureType) {
      this._textureType = textureType;
    },
    get: function get() {
      return this._textureType;
    }
  }, {
    key: 'bitsAllocated',
    set: function set(bitsAllocated) {
      this._bitsAllocated = bitsAllocated;
    },
    get: function get() {
      return this._bitsAllocated;
    }
  }, {
    key: 'rawData',
    set: function set(rawData) {
      this._rawData = rawData;
    },
    get: function get() {
      return this._rawData;
    }
  }, {
    key: 'windowWidth',
    get: function get() {
      return this._windowWidth;
    },
    set: function set(windowWidth) {
      this._windowWidth = windowWidth;
    }
  }, {
    key: 'windowCenter',
    get: function get() {
      return this._windowCenter;
    },
    set: function set(windowCenter) {
      this._windowCenter = windowCenter;
    }
  }, {
    key: 'rescaleSlope',
    get: function get() {
      return this._rescaleSlope;
    },
    set: function set(rescaleSlope) {
      this._rescaleSlope = rescaleSlope;
    }
  }, {
    key: 'rescaleIntercept',
    get: function get() {
      return this._rescaleIntercept;
    },
    set: function set(rescaleIntercept) {
      this._rescaleIntercept = rescaleIntercept;
    }
  }, {
    key: 'xCosine',
    get: function get() {
      return this._xCosine;
    },
    set: function set(xCosine) {
      this._xCosine = xCosine;
    }
  }, {
    key: 'yCosine',
    get: function get() {
      return this._yCosine;
    },
    set: function set(yCosine) {
      this._yCosine = yCosine;
    }
  }, {
    key: 'zCosine',
    get: function get() {
      return this._zCosine;
    },
    set: function set(zCosine) {
      this._zCosine = zCosine;
    }
  }, {
    key: 'windowCenterWidth',
    get: function get() {
      return this._windowCenterWidth;
    },
    set: function set(windowCenterWidth) {
      this._windowCenterWidth = windowCenterWidth;
    }
  }, {
    key: 'rescaleSlopeIntercept',
    get: function get() {
      return this._rescaleSlopeIntercept;
    },
    set: function set(rescaleSlopeIntercept) {
      this._rescaleSlopeIntercept = rescaleSlopeIntercept;
    }
  }, {
    key: 'minMax',
    get: function get() {
      return this._minMax;
    },
    set: function set(minMax) {
      this._minMax = minMax;
    }
  }, {
    key: 'stackID',
    get: function get() {
      return this._stackID;
    },
    set: function set(stackID) {
      this._stackID = stackID;
    }
  }], [{
    key: 'worldToData',
    value: function worldToData(stack, worldCoordinates) {
      var dataCoordinate = new THREE.Vector3().copy(worldCoordinates).applyMatrix4(stack._lps2IJK);

      // same rounding in the shaders
      dataCoordinate.x = Math.floor(dataCoordinate.x + 0.5);
      dataCoordinate.y = Math.floor(dataCoordinate.y + 0.5);
      dataCoordinate.z = Math.floor(dataCoordinate.z + 0.5);

      return dataCoordinate;
    }
  }, {
    key: 'value',
    value: function value(stack, ijkCoordinate) {
      if (ijkCoordinate.z >= 0 && ijkCoordinate.z < stack._frame.length) {
        return _models2.default.value(stack._frame[ijkCoordinate.z], ijkCoordinate.x, ijkCoordinate.y);
      } else {
        return null;
      }
    }
  }, {
    key: 'valueRescaleSlopeIntercept',
    value: function valueRescaleSlopeIntercept(value, slope, intercept) {
      return value * slope + intercept;
    }
  }, {
    key: 'indexInDimensions',
    value: function indexInDimensions(index, dimensions) {
      if (index.x >= 0 && index.y >= 0 && index.z >= 0 && index.x < dimensions.x && index.y < dimensions.y && index.z < dimensions.z) {

        return true;
      }

      return false;
    }
  }]);

  return ModelsStack;
}();

exports.default = ModelsStack;

},{"../../src/models/models.frame":31}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelsVoxel = function () {
  function ModelsVoxel() {
    _classCallCheck(this, ModelsVoxel);

    this._id = -1;
    this._worldCoordinates = null;
    this._dataCoordinates = null;
    this._screenCoordinates = null;
    this._value = null;
  }

  _createClass(ModelsVoxel, [{
    key: "worldCoordinates",
    set: function set(worldCoordinates) {
      this._worldCoordinates = worldCoordinates;
    },
    get: function get() {
      return this._worldCoordinates;
    }
  }, {
    key: "dataCoordinates",
    set: function set(dataCoordinates) {
      this._dataCoordinates = dataCoordinates;
    },
    get: function get() {
      return this._dataCoordinates;
    }
  }, {
    key: "screenCoordinates",
    set: function set(screenCoordinates) {
      this._screenCoordinates = screenCoordinates;
    },
    get: function get() {
      return this._screenCoordinates;
    }
  }, {
    key: "value",
    set: function set(value) {
      this._value = value;
    },
    get: function get() {
      return this._value;
    }
  }, {
    key: "id",
    set: function set(id) {
      this._id = id;
    },
    get: function get() {
      return this._id;
    }
  }]);

  return ModelsVoxel;
}();

exports.default = ModelsVoxel;

},{}],36:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// jshint ignore: start

/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
 /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/*
 Copyright 2011 notmasteryet

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// - The JPEG specification can be found in the ITU CCITT Recommendation T.81
//   (www.w3.org/Graphics/JPEG/itu-t81.pdf)
// - The JFIF specification can be found in the JPEG File Interchange Format
//   (www.w3.org/Graphics/JPEG/jfif3.pdf)
// - The Adobe Application-Specific JPEG markers in the Supporting the DCT Filters
//   in PostScript Level 2, Technical Note #5116
//   (partners.adobe.com/public/developer/en/ps/sdk/5116.DCT_Filter.pdf)

var ColorSpace = { Unkown: 0, Grayscale: 1, AdobeRGB: 2, RGB: 3, CYMK: 4 };
var JpegImage = function jpegImage() {
  "use strict";

  var dctZigZag = new Int32Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);

  var dctCos1 = 4017; // cos(pi/16)
  var dctSin1 = 799; // sin(pi/16)
  var dctCos3 = 3406; // cos(3*pi/16)
  var dctSin3 = 2276; // sin(3*pi/16)
  var dctCos6 = 1567; // cos(6*pi/16)
  var dctSin6 = 3784; // sin(6*pi/16)
  var dctSqrt2 = 5793; // sqrt(2)
  var dctSqrt1d2 = 2896; // sqrt(2) / 2

  function constructor() {}

  function buildHuffmanTable(codeLengths, values) {
    var k = 0,
        code = [],
        i,
        j,
        length = 16;
    while (length > 0 && !codeLengths[length - 1]) {
      length--;
    }code.push({ children: [], index: 0 });
    var p = code[0],
        q;
    for (i = 0; i < length; i++) {
      for (j = 0; j < codeLengths[i]; j++) {
        p = code.pop();
        p.children[p.index] = values[k];
        while (p.index > 0) {
          p = code.pop();
        }
        p.index++;
        code.push(p);
        while (code.length <= i) {
          code.push(q = { children: [], index: 0 });
          p.children[p.index] = q.children;
          p = q;
        }
        k++;
      }
      if (i + 1 < length) {
        // p here points to last code
        code.push(q = { children: [], index: 0 });
        p.children[p.index] = q.children;
        p = q;
      }
    }
    return code[0].children;
  }

  function getBlockBufferOffset(component, row, col) {
    return 64 * ((component.blocksPerLine + 1) * row + col);
  }

  function decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successivePrev, successive) {
    var precision = frame.precision;
    var samplesPerLine = frame.samplesPerLine;
    var scanLines = frame.scanLines;
    var mcusPerLine = frame.mcusPerLine;
    var progressive = frame.progressive;
    var maxH = frame.maxH,
        maxV = frame.maxV;

    var startOffset = offset,
        bitsData = 0,
        bitsCount = 0;

    function readBit() {
      if (bitsCount > 0) {
        bitsCount--;
        return bitsData >> bitsCount & 1;
      }
      bitsData = data[offset++];
      if (bitsData == 0xFF) {
        var nextByte = data[offset++];
        if (nextByte) {
          throw "unexpected marker: " + (bitsData << 8 | nextByte).toString(16);
        }
        // unstuff 0
      }
      bitsCount = 7;
      return bitsData >>> 7;
    }

    function decodeHuffman(tree) {
      var node = tree;
      var bit;
      while ((bit = readBit()) !== null) {
        node = node[bit];
        if (typeof node === 'number') return node;
        if ((typeof node === "undefined" ? "undefined" : _typeof(node)) !== 'object') throw "invalid huffman sequence";
      }
      return null;
    }

    function receive(length) {
      var n = 0;
      while (length > 0) {
        var bit = readBit();
        if (bit === null) return;
        n = n << 1 | bit;
        length--;
      }
      return n;
    }

    function receiveAndExtend(length) {
      var n = receive(length);
      if (n >= 1 << length - 1) return n;
      return n + (-1 << length) + 1;
    }

    function decodeBaseline(component, offset) {
      var t = decodeHuffman(component.huffmanTableDC);
      var diff = t === 0 ? 0 : receiveAndExtend(t);
      component.blockData[offset] = component.pred += diff;
      var k = 1;
      while (k < 64) {
        var rs = decodeHuffman(component.huffmanTableAC);
        var s = rs & 15,
            r = rs >> 4;
        if (s === 0) {
          if (r < 15) break;
          k += 16;
          continue;
        }
        k += r;
        var z = dctZigZag[k];
        component.blockData[offset + z] = receiveAndExtend(s);
        k++;
      }
    }

    function decodeDCFirst(component, offset) {
      var t = decodeHuffman(component.huffmanTableDC);
      var diff = t === 0 ? 0 : receiveAndExtend(t) << successive;
      component.blockData[offset] = component.pred += diff;
    }

    function decodeDCSuccessive(component, offset) {
      component.blockData[offset] |= readBit() << successive;
    }

    var eobrun = 0;
    function decodeACFirst(component, offset) {
      if (eobrun > 0) {
        eobrun--;
        return;
      }
      var k = spectralStart,
          e = spectralEnd;
      while (k <= e) {
        var rs = decodeHuffman(component.huffmanTableAC);
        var s = rs & 15,
            r = rs >> 4;
        if (s === 0) {
          if (r < 15) {
            eobrun = receive(r) + (1 << r) - 1;
            break;
          }
          k += 16;
          continue;
        }
        k += r;
        var z = dctZigZag[k];
        component.blockData[offset + z] = receiveAndExtend(s) * (1 << successive);
        k++;
      }
    }

    var successiveACState = 0,
        successiveACNextValue;
    function decodeACSuccessive(component, offset) {
      var k = spectralStart,
          e = spectralEnd,
          r = 0;
      while (k <= e) {
        var z = dctZigZag[k];
        switch (successiveACState) {
          case 0:
            // initial state
            var rs = decodeHuffman(component.huffmanTableAC);
            var s = rs & 15;
            r = rs >> 4;
            if (s === 0) {
              if (r < 15) {
                eobrun = receive(r) + (1 << r);
                successiveACState = 4;
              } else {
                r = 16;
                successiveACState = 1;
              }
            } else {
              if (s !== 1) throw "invalid ACn encoding";
              successiveACNextValue = receiveAndExtend(s);
              successiveACState = r ? 2 : 3;
            }
            continue;
          case 1: // skipping r zero items
          case 2:
            if (component.blockData[offset + z]) {
              component.blockData[offset + z] += readBit() << successive;
            } else {
              r--;
              if (r === 0) successiveACState = successiveACState == 2 ? 3 : 0;
            }
            break;
          case 3:
            // set value for a zero item
            if (component.blockData[offset + z]) {
              component.blockData[offset + z] += readBit() << successive;
            } else {
              component.blockData[offset + z] = successiveACNextValue << successive;
              successiveACState = 0;
            }
            break;
          case 4:
            // eob
            if (component.blockData[offset + z]) {
              component.blockData[offset + z] += readBit() << successive;
            }
            break;
        }
        k++;
      }
      if (successiveACState === 4) {
        eobrun--;
        if (eobrun === 0) successiveACState = 0;
      }
    }

    function decodeMcu(component, decode, mcu, row, col) {
      var mcuRow = mcu / mcusPerLine | 0;
      var mcuCol = mcu % mcusPerLine;
      var blockRow = mcuRow * component.v + row;
      var blockCol = mcuCol * component.h + col;
      var offset = getBlockBufferOffset(component, blockRow, blockCol);
      decode(component, offset);
    }

    function decodeBlock(component, decode, mcu) {
      var blockRow = mcu / component.blocksPerLine | 0;
      var blockCol = mcu % component.blocksPerLine;
      var offset = getBlockBufferOffset(component, blockRow, blockCol);
      decode(component, offset);
    }

    var componentsLength = components.length;
    var component, i, j, k, n;
    var decodeFn;
    if (progressive) {
      if (spectralStart === 0) decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;else decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
    } else {
      decodeFn = decodeBaseline;
    }

    var mcu = 0,
        marker;
    var mcuExpected;
    if (componentsLength == 1) {
      mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
    } else {
      mcuExpected = mcusPerLine * frame.mcusPerColumn;
    }
    if (!resetInterval) {
      resetInterval = mcuExpected;
    }

    var h, v;
    while (mcu < mcuExpected) {
      // reset interval stuff
      for (i = 0; i < componentsLength; i++) {
        components[i].pred = 0;
      }
      eobrun = 0;

      if (componentsLength == 1) {
        component = components[0];
        for (n = 0; n < resetInterval; n++) {
          decodeBlock(component, decodeFn, mcu);
          mcu++;
        }
      } else {
        for (n = 0; n < resetInterval; n++) {
          for (i = 0; i < componentsLength; i++) {
            component = components[i];
            h = component.h;
            v = component.v;
            for (j = 0; j < v; j++) {
              for (k = 0; k < h; k++) {
                decodeMcu(component, decodeFn, mcu, j, k);
              }
            }
          }
          mcu++;
        }
      }

      // find marker
      bitsCount = 0;
      marker = data[offset] << 8 | data[offset + 1];
      if (marker <= 0xFF00) {
        throw "marker was not found";
      }

      if (marker >= 0xFFD0 && marker <= 0xFFD7) {
        // RSTx
        offset += 2;
      } else {
        break;
      }
    }

    return offset - startOffset;
  }

  // A port of poppler's IDCT method which in turn is taken from:
  //   Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
  //   "Practical Fast 1-D DCT Algorithms with 11 Multiplications",
  //   IEEE Intl. Conf. on Acoustics, Speech & Signal Processing, 1989,
  //   988-991.
  function quantizeAndInverse(component, blockBufferOffset, p) {
    var qt = component.quantizationTable;
    var v0, v1, v2, v3, v4, v5, v6, v7, t;
    var i;

    // dequant
    for (i = 0; i < 64; i++) {
      p[i] = component.blockData[blockBufferOffset + i] * qt[i];
    }

    // inverse DCT on rows
    for (i = 0; i < 8; ++i) {
      var row = 8 * i;

      // check for all-zero AC coefficients
      if (p[1 + row] === 0 && p[2 + row] === 0 && p[3 + row] === 0 && p[4 + row] === 0 && p[5 + row] === 0 && p[6 + row] === 0 && p[7 + row] === 0) {
        t = dctSqrt2 * p[0 + row] + 512 >> 10;
        p[0 + row] = t;
        p[1 + row] = t;
        p[2 + row] = t;
        p[3 + row] = t;
        p[4 + row] = t;
        p[5 + row] = t;
        p[6 + row] = t;
        p[7 + row] = t;
        continue;
      }

      // stage 4
      v0 = dctSqrt2 * p[0 + row] + 128 >> 8;
      v1 = dctSqrt2 * p[4 + row] + 128 >> 8;
      v2 = p[2 + row];
      v3 = p[6 + row];
      v4 = dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128 >> 8;
      v7 = dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128 >> 8;
      v5 = p[3 + row] << 4;
      v6 = p[5 + row] << 4;

      // stage 3
      t = v0 - v1 + 1 >> 1;
      v0 = v0 + v1 + 1 >> 1;
      v1 = t;
      t = v2 * dctSin6 + v3 * dctCos6 + 128 >> 8;
      v2 = v2 * dctCos6 - v3 * dctSin6 + 128 >> 8;
      v3 = t;
      t = v4 - v6 + 1 >> 1;
      v4 = v4 + v6 + 1 >> 1;
      v6 = t;
      t = v7 + v5 + 1 >> 1;
      v5 = v7 - v5 + 1 >> 1;
      v7 = t;

      // stage 2
      t = v0 - v3 + 1 >> 1;
      v0 = v0 + v3 + 1 >> 1;
      v3 = t;
      t = v1 - v2 + 1 >> 1;
      v1 = v1 + v2 + 1 >> 1;
      v2 = t;
      t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
      v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
      v7 = t;
      t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
      v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
      v6 = t;

      // stage 1
      p[0 + row] = v0 + v7;
      p[7 + row] = v0 - v7;
      p[1 + row] = v1 + v6;
      p[6 + row] = v1 - v6;
      p[2 + row] = v2 + v5;
      p[5 + row] = v2 - v5;
      p[3 + row] = v3 + v4;
      p[4 + row] = v3 - v4;
    }

    // inverse DCT on columns
    for (i = 0; i < 8; ++i) {
      var col = i;

      // check for all-zero AC coefficients
      if (p[1 * 8 + col] === 0 && p[2 * 8 + col] === 0 && p[3 * 8 + col] === 0 && p[4 * 8 + col] === 0 && p[5 * 8 + col] === 0 && p[6 * 8 + col] === 0 && p[7 * 8 + col] === 0) {
        t = dctSqrt2 * p[i + 0] + 8192 >> 14;
        p[0 * 8 + col] = t;
        p[1 * 8 + col] = t;
        p[2 * 8 + col] = t;
        p[3 * 8 + col] = t;
        p[4 * 8 + col] = t;
        p[5 * 8 + col] = t;
        p[6 * 8 + col] = t;
        p[7 * 8 + col] = t;
        continue;
      }

      // stage 4
      v0 = dctSqrt2 * p[0 * 8 + col] + 2048 >> 12;
      v1 = dctSqrt2 * p[4 * 8 + col] + 2048 >> 12;
      v2 = p[2 * 8 + col];
      v3 = p[6 * 8 + col];
      v4 = dctSqrt1d2 * (p[1 * 8 + col] - p[7 * 8 + col]) + 2048 >> 12;
      v7 = dctSqrt1d2 * (p[1 * 8 + col] + p[7 * 8 + col]) + 2048 >> 12;
      v5 = p[3 * 8 + col];
      v6 = p[5 * 8 + col];

      // stage 3
      t = v0 - v1 + 1 >> 1;
      v0 = v0 + v1 + 1 >> 1;
      v1 = t;
      t = v2 * dctSin6 + v3 * dctCos6 + 2048 >> 12;
      v2 = v2 * dctCos6 - v3 * dctSin6 + 2048 >> 12;
      v3 = t;
      t = v4 - v6 + 1 >> 1;
      v4 = v4 + v6 + 1 >> 1;
      v6 = t;
      t = v7 + v5 + 1 >> 1;
      v5 = v7 - v5 + 1 >> 1;
      v7 = t;

      // stage 2
      t = v0 - v3 + 1 >> 1;
      v0 = v0 + v3 + 1 >> 1;
      v3 = t;
      t = v1 - v2 + 1 >> 1;
      v1 = v1 + v2 + 1 >> 1;
      v2 = t;
      t = v4 * dctSin3 + v7 * dctCos3 + 2048 >> 12;
      v4 = v4 * dctCos3 - v7 * dctSin3 + 2048 >> 12;
      v7 = t;
      t = v5 * dctSin1 + v6 * dctCos1 + 2048 >> 12;
      v5 = v5 * dctCos1 - v6 * dctSin1 + 2048 >> 12;
      v6 = t;

      // stage 1
      p[0 * 8 + col] = v0 + v7;
      p[7 * 8 + col] = v0 - v7;
      p[1 * 8 + col] = v1 + v6;
      p[6 * 8 + col] = v1 - v6;
      p[2 * 8 + col] = v2 + v5;
      p[5 * 8 + col] = v2 - v5;
      p[3 * 8 + col] = v3 + v4;
      p[4 * 8 + col] = v3 - v4;
    }

    // convert to 8-bit integers
    for (i = 0; i < 64; ++i) {
      var index = blockBufferOffset + i;
      var q = p[i];
      q = q <= -2056 / component.bitConversion ? 0 : q >= 2024 / component.bitConversion ? 255 / component.bitConversion : q + 2056 / component.bitConversion >> 4;
      component.blockData[index] = q;
    }
  }

  function buildComponentData(frame, component) {
    var lines = [];
    var blocksPerLine = component.blocksPerLine;
    var blocksPerColumn = component.blocksPerColumn;
    var samplesPerLine = blocksPerLine << 3;
    var computationBuffer = new Int32Array(64);

    var i,
        j,
        ll = 0;
    for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
      for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
        var offset = getBlockBufferOffset(component, blockRow, blockCol);
        quantizeAndInverse(component, offset, computationBuffer);
      }
    }
    return component.blockData;
  }

  function clampToUint8(a) {
    return a <= 0 ? 0 : a >= 255 ? 255 : a | 0;
  }

  constructor.prototype = {
    load: function load(path) {
      var handleData = function (data) {
        this.parse(data);
        if (this.onload) this.onload();
      }.bind(this);

      if (path.indexOf("data:") > -1) {
        var offset = path.indexOf("base64,") + 7;
        var data = atob(path.substring(offset));
        var arr = new Uint8Array(data.length);
        for (var i = data.length - 1; i >= 0; i--) {
          arr[i] = data.charCodeAt(i);
        }
        handleData(data);
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
          // TODO catch parse error
          var data = new Uint8Array(xhr.response);
          handleData(data);
        }.bind(this);
        xhr.send(null);
      }
    },
    parse: function parse(data) {

      function readUint16() {
        var value = data[offset] << 8 | data[offset + 1];
        offset += 2;
        return value;
      }

      function readDataBlock() {
        var length = readUint16();
        var array = data.subarray(offset, offset + length - 2);
        offset += array.length;
        return array;
      }

      function prepareComponents(frame) {
        var mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / frame.maxH);
        var mcusPerColumn = Math.ceil(frame.scanLines / 8 / frame.maxV);
        for (var i = 0; i < frame.components.length; i++) {
          component = frame.components[i];
          var blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / frame.maxH);
          var blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) * component.v / frame.maxV);
          var blocksPerLineForMcu = mcusPerLine * component.h;
          var blocksPerColumnForMcu = mcusPerColumn * component.v;

          var blocksBufferSize = 64 * blocksPerColumnForMcu * (blocksPerLineForMcu + 1);
          component.blockData = new Int16Array(blocksBufferSize);
          component.blocksPerLine = blocksPerLine;
          component.blocksPerColumn = blocksPerColumn;
        }
        frame.mcusPerLine = mcusPerLine;
        frame.mcusPerColumn = mcusPerColumn;
      }

      var offset = 0,
          length = data.length;
      var jfif = null;
      var adobe = null;
      var pixels = null;
      var frame, resetInterval;
      var quantizationTables = [];
      var huffmanTablesAC = [],
          huffmanTablesDC = [];
      var fileMarker = readUint16();
      if (fileMarker != 0xFFD8) {
        // SOI (Start of Image)
        throw "SOI not found";
      }

      fileMarker = readUint16();
      while (fileMarker != 0xFFD9) {
        // EOI (End of image)
        var i, j, l;
        switch (fileMarker) {
          case 0xFFE0: // APP0 (Application Specific)
          case 0xFFE1: // APP1
          case 0xFFE2: // APP2
          case 0xFFE3: // APP3
          case 0xFFE4: // APP4
          case 0xFFE5: // APP5
          case 0xFFE6: // APP6
          case 0xFFE7: // APP7
          case 0xFFE8: // APP8
          case 0xFFE9: // APP9
          case 0xFFEA: // APP10
          case 0xFFEB: // APP11
          case 0xFFEC: // APP12
          case 0xFFED: // APP13
          case 0xFFEE: // APP14
          case 0xFFEF: // APP15
          case 0xFFFE:
            // COM (Comment)
            var appData = readDataBlock();

            if (fileMarker === 0xFFE0) {
              if (appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 && appData[3] === 0x46 && appData[4] === 0) {
                // 'JFIF\x00'
                jfif = {
                  version: { major: appData[5], minor: appData[6] },
                  densityUnits: appData[7],
                  xDensity: appData[8] << 8 | appData[9],
                  yDensity: appData[10] << 8 | appData[11],
                  thumbWidth: appData[12],
                  thumbHeight: appData[13],
                  thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                };
              }
            }
            // TODO APP1 - Exif
            if (fileMarker === 0xFFEE) {
              if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F && appData[3] === 0x62 && appData[4] === 0x65 && appData[5] === 0) {
                // 'Adobe\x00'
                adobe = {
                  version: appData[6],
                  flags0: appData[7] << 8 | appData[8],
                  flags1: appData[9] << 8 | appData[10],
                  transformCode: appData[11]
                };
              }
            }
            break;

          case 0xFFDB:
            // DQT (Define Quantization Tables)
            var quantizationTablesLength = readUint16();
            var quantizationTablesEnd = quantizationTablesLength + offset - 2;
            while (offset < quantizationTablesEnd) {
              var quantizationTableSpec = data[offset++];
              var tableData = new Int32Array(64);
              if (quantizationTableSpec >> 4 === 0) {
                // 8 bit values
                for (j = 0; j < 64; j++) {
                  var z = dctZigZag[j];
                  tableData[z] = data[offset++];
                }
              } else if (quantizationTableSpec >> 4 === 1) {
                //16 bit
                for (j = 0; j < 64; j++) {
                  var zz = dctZigZag[j];
                  tableData[zz] = readUint16();
                }
              } else throw "DQT: invalid table spec";
              quantizationTables[quantizationTableSpec & 15] = tableData;
            }
            break;

          case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
          case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
          case 0xFFC2:
            // SOF2 (Start of Frame, Progressive DCT)
            if (frame) {
              throw "Only single frame JPEGs supported";
            }
            readUint16(); // skip data length
            frame = {};
            frame.extended = fileMarker === 0xFFC1;
            frame.progressive = fileMarker === 0xFFC2;
            frame.precision = data[offset++];
            frame.scanLines = readUint16();
            frame.samplesPerLine = readUint16();
            frame.components = [];
            frame.componentIds = {};
            var componentsCount = data[offset++],
                componentId;
            var maxH = 0,
                maxV = 0;
            for (i = 0; i < componentsCount; i++) {
              componentId = data[offset];
              var h = data[offset + 1] >> 4;
              var v = data[offset + 1] & 15;
              if (maxH < h) maxH = h;
              if (maxV < v) maxV = v;
              var qId = data[offset + 2];
              l = frame.components.push({
                h: h,
                v: v,
                quantizationTable: quantizationTables[qId],
                quantizationTableId: qId,
                bitConversion: 255 / ((1 << frame.precision) - 1)
              });
              frame.componentIds[componentId] = l - 1;
              offset += 3;
            }
            frame.maxH = maxH;
            frame.maxV = maxV;
            prepareComponents(frame);
            break;

          case 0xFFC4:
            // DHT (Define Huffman Tables)
            var huffmanLength = readUint16();
            for (i = 2; i < huffmanLength;) {
              var huffmanTableSpec = data[offset++];
              var codeLengths = new Uint8Array(16);
              var codeLengthSum = 0;
              for (j = 0; j < 16; j++, offset++) {
                codeLengthSum += codeLengths[j] = data[offset];
              }var huffmanValues = new Uint8Array(codeLengthSum);
              for (j = 0; j < codeLengthSum; j++, offset++) {
                huffmanValues[j] = data[offset];
              }i += 17 + codeLengthSum;

              (huffmanTableSpec >> 4 === 0 ? huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
            }
            break;

          case 0xFFDD:
            // DRI (Define Restart Interval)
            readUint16(); // skip data length
            resetInterval = readUint16();
            break;

          case 0xFFDA:
            // SOS (Start of Scan)
            var scanLength = readUint16();
            var selectorsCount = data[offset++];
            var components = [],
                component;
            for (i = 0; i < selectorsCount; i++) {
              var componentIndex = frame.componentIds[data[offset++]];
              component = frame.components[componentIndex];
              var tableSpec = data[offset++];
              component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
              component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
              components.push(component);
            }
            var spectralStart = data[offset++];
            var spectralEnd = data[offset++];
            var successiveApproximation = data[offset++];
            var processed = decodeScan(data, offset, frame, components, resetInterval, spectralStart, spectralEnd, successiveApproximation >> 4, successiveApproximation & 15);
            offset += processed;
            break;
          default:
            if (data[offset - 3] == 0xFF && data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) {
              // could be incorrect encoding -- last 0xFF byte of the previous
              // block was eaten by the encoder
              offset -= 3;
              break;
            }
            throw "unknown JPEG marker " + fileMarker.toString(16);
        }
        fileMarker = readUint16();
      }

      this.width = frame.samplesPerLine;
      this.height = frame.scanLines;
      this.jfif = jfif;
      this.adobe = adobe;
      this.components = [];
      switch (frame.components.length) {
        case 1:
          this.colorspace = ColorSpace.Grayscale;
          break;
        case 3:
          if (this.adobe) this.colorspace = ColorSpace.AdobeRGB;else this.colorspace = ColorSpace.RGB;
          break;
        case 4:
          this.colorspace = ColorSpace.CYMK;
          break;
        default:
          this.colorspace = ColorSpace.Unknown;
      }
      for (var i = 0; i < frame.components.length; i++) {
        var component = frame.components[i];
        if (!component.quantizationTable && component.quantizationTableId !== null) component.quantizationTable = quantizationTables[component.quantizationTableId];
        this.components.push({
          output: buildComponentData(frame, component),
          scaleX: component.h / frame.maxH,
          scaleY: component.v / frame.maxV,
          blocksPerLine: component.blocksPerLine,
          blocksPerColumn: component.blocksPerColumn,
          bitConversion: component.bitConversion
        });
      }
    },
    getData16: function getData16(width, height) {
      if (this.components.length !== 1) throw 'Unsupported color mode';
      var scaleX = this.width / width,
          scaleY = this.height / height;

      var component, componentScaleX, componentScaleY;
      var x, y, i;
      var offset = 0;
      var numComponents = this.components.length;
      var dataLength = width * height * numComponents;
      var data = new Uint16Array(dataLength);
      var componentLine;

      // lineData is reused for all components. Assume first component is
      // the biggest
      var lineData = new Uint16Array((this.components[0].blocksPerLine << 3) * this.components[0].blocksPerColumn * 8);

      // First construct image data ...
      for (i = 0; i < numComponents; i++) {
        component = this.components[i];
        var blocksPerLine = component.blocksPerLine;
        var blocksPerColumn = component.blocksPerColumn;
        var samplesPerLine = blocksPerLine << 3;

        var j,
            k,
            ll = 0;
        var lineOffset = 0;
        for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
          var scanLine = blockRow << 3;
          for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
            var bufferOffset = getBlockBufferOffset(component, blockRow, blockCol);
            var offset = 0,
                sample = blockCol << 3;
            for (j = 0; j < 8; j++) {
              var lineOffset = (scanLine + j) * samplesPerLine;
              for (k = 0; k < 8; k++) {
                lineData[lineOffset + sample + k] = component.output[bufferOffset + offset++];
              }
            }
          }
        }

        componentScaleX = component.scaleX * scaleX;
        componentScaleY = component.scaleY * scaleY;
        offset = i;

        var cx, cy;
        var index;
        for (y = 0; y < height; y++) {
          for (x = 0; x < width; x++) {
            cy = 0 | y * componentScaleY;
            cx = 0 | x * componentScaleX;
            index = cy * samplesPerLine + cx;
            data[offset] = lineData[index];
            offset += numComponents;
          }
        }
      }
      return data;
    },
    getData: function getData(width, height) {
      var scaleX = this.width / width,
          scaleY = this.height / height;

      var component, componentScaleX, componentScaleY;
      var x, y, i;
      var offset = 0;
      var Y, Cb, Cr, K, C, M, Ye, R, G, B;
      var colorTransform;
      var numComponents = this.components.length;
      var dataLength = width * height * numComponents;
      var data = new Uint8Array(dataLength);
      var componentLine;

      // lineData is reused for all components. Assume first component is
      // the biggest
      var lineData = new Uint8Array((this.components[0].blocksPerLine << 3) * this.components[0].blocksPerColumn * 8);

      // First construct image data ...
      for (i = 0; i < numComponents; i++) {
        component = this.components[i];
        var blocksPerLine = component.blocksPerLine;
        var blocksPerColumn = component.blocksPerColumn;
        var samplesPerLine = blocksPerLine << 3;

        var j,
            k,
            ll = 0;
        var lineOffset = 0;
        for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
          var scanLine = blockRow << 3;
          for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
            var bufferOffset = getBlockBufferOffset(component, blockRow, blockCol);
            var offset = 0,
                sample = blockCol << 3;
            for (j = 0; j < 8; j++) {
              var lineOffset = (scanLine + j) * samplesPerLine;
              for (k = 0; k < 8; k++) {
                lineData[lineOffset + sample + k] = component.output[bufferOffset + offset++] * component.bitConversion;
              }
            }
          }
        }

        componentScaleX = component.scaleX * scaleX;
        componentScaleY = component.scaleY * scaleY;
        offset = i;

        var cx, cy;
        var index;
        for (y = 0; y < height; y++) {
          for (x = 0; x < width; x++) {
            cy = 0 | y * componentScaleY;
            cx = 0 | x * componentScaleX;
            index = cy * samplesPerLine + cx;
            data[offset] = lineData[index];
            offset += numComponents;
          }
        }
      }

      // ... then transform colors, if necessary
      switch (numComponents) {
        case 1:
        case 2:
          break;
        // no color conversion for one or two compoenents

        case 3:
          // The default transform for three components is true
          colorTransform = true;
          // The adobe transform marker overrides any previous setting
          if (this.adobe && this.adobe.transformCode) colorTransform = true;else if (typeof this.colorTransform !== 'undefined') colorTransform = !!this.colorTransform;

          if (colorTransform) {
            for (i = 0; i < dataLength; i += numComponents) {
              Y = data[i];
              Cb = data[i + 1];
              Cr = data[i + 2];

              R = clampToUint8(Y - 179.456 + 1.402 * Cr);
              G = clampToUint8(Y + 135.459 - 0.344 * Cb - 0.714 * Cr);
              B = clampToUint8(Y - 226.816 + 1.772 * Cb);

              data[i] = R;
              data[i + 1] = G;
              data[i + 2] = B;
            }
          }
          break;
        case 4:
          if (!this.adobe) throw 'Unsupported color mode (4 components)';
          // The default transform for four components is false
          colorTransform = false;
          // The adobe transform marker overrides any previous setting
          if (this.adobe && this.adobe.transformCode) colorTransform = true;else if (typeof this.colorTransform !== 'undefined') colorTransform = !!this.colorTransform;

          if (colorTransform) {
            for (i = 0; i < dataLength; i += numComponents) {
              Y = data[i];
              Cb = data[i + 1];
              Cr = data[i + 2];

              C = clampToUint8(434.456 - Y - 1.402 * Cr);
              M = clampToUint8(119.541 - Y + 0.344 * Cb + 0.714 * Cr);
              Y = clampToUint8(481.816 - Y - 1.772 * Cb);

              data[i] = C;
              data[i + 1] = M;
              data[i + 2] = Y;
              // K is unchanged
            }
          }
          break;
        default:
          throw 'Unsupported color mode';
      }
      return data;
    }
  };

  return constructor;
}();

var moduleType = typeof module === "undefined" ? "undefined" : _typeof(module);
if (moduleType !== 'undefined' && module.exports) {
  module.exports = JpegImage;
}

},{}],37:[function(require,module,exports){
/*! image-JPEG2000 - v0.3.1 - 2015-08-26 | https://github.com/OHIF/image-JPEG2000 */ /* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */ /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */ /* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /* globals ArithmeticDecoder, globalScope, log2, readUint16, readUint32,
           info, warn */'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};var JpxImage=function JpxImageClosure(){ // Table E.1
var SubbandsGainLog2={'LL':0,'LH':1,'HL':1,'HH':2};function JpxImage(){this.failOnCorruptedImage=false;}JpxImage.prototype={parse:function JpxImage_parse(data){var head=readUint16(data,0); // No box header, immediate start of codestream (SOC)
if(head===0xFF4F){this.parseCodestream(data,0,data.length);return;}var position=0,length=data.length;while(position<length){var headerSize=8;var lbox=readUint32(data,position);var tbox=readUint32(data,position+4);position+=headerSize;if(lbox===1){ // XLBox: read UInt64 according to spec.
// JavaScript's int precision of 53 bit should be sufficient here.
lbox=readUint32(data,position)*4294967296+readUint32(data,position+4);position+=8;headerSize+=8;}if(lbox===0){lbox=length-position+headerSize;}if(lbox<headerSize){throw new Error('JPX Error: Invalid box field size');}var dataLength=lbox-headerSize;var jumpDataLength=true;switch(tbox){case 0x6A703268: // 'jp2h'
jumpDataLength=false; // parsing child boxes
break;case 0x636F6C72: // 'colr'
// Colorspaces are not used, the CS from the PDF is used.
var method=data[position];var precedence=data[position+1];var approximation=data[position+2];if(method===1){ // enumerated colorspace
var colorspace=readUint32(data,position+3);switch(colorspace){case 16: // this indicates a sRGB colorspace
case 17: // this indicates a grayscale colorspace
case 18: // this indicates a YUV colorspace
break;default:warn('Unknown colorspace '+colorspace);break;}}else if(method===2){info('ICC profile not supported');}break;case 0x6A703263: // 'jp2c'
this.parseCodestream(data,position,position+dataLength);break;case 0x6A502020: // 'jP\024\024'
if(0x0d0a870a!==readUint32(data,position)){warn('Invalid JP2 signature');}break; // The following header types are valid but currently not used:
case 0x6A501A1A: // 'jP\032\032'
case 0x66747970: // 'ftyp'
case 0x72726571: // 'rreq'
case 0x72657320: // 'res '
case 0x69686472: // 'ihdr'
break;default:var headerType=String.fromCharCode(tbox>>24&0xFF,tbox>>16&0xFF,tbox>>8&0xFF,tbox&0xFF);warn('Unsupported header type '+tbox+' ('+headerType+')');break;}if(jumpDataLength){position+=dataLength;}}},parseImageProperties:function JpxImage_parseImageProperties(stream){var newByte=stream.getByte();while(newByte>=0){var oldByte=newByte;newByte=stream.getByte();var code=oldByte<<8|newByte; // Image and tile size (SIZ)
if(code===0xFF51){stream.skip(4);var Xsiz=stream.getInt32()>>>0; // Byte 4
var Ysiz=stream.getInt32()>>>0; // Byte 8
var XOsiz=stream.getInt32()>>>0; // Byte 12
var YOsiz=stream.getInt32()>>>0; // Byte 16
stream.skip(16);var Csiz=stream.getUint16(); // Byte 36
this.width=Xsiz-XOsiz;this.height=Ysiz-YOsiz;this.componentsCount=Csiz; // Results are always returned as Uint8Arrays
this.bitsPerComponent=8;return;}}throw new Error('JPX Error: No size marker found in JPX stream');},parseCodestream:function JpxImage_parseCodestream(data,start,end){var context={};try{var doNotRecover=false;var position=start;while(position+1<end){var code=readUint16(data,position);position+=2;var length=0,j,sqcd,spqcds,spqcdSize,scalarExpounded,tile;switch(code){case 0xFF4F: // Start of codestream (SOC)
context.mainHeader=true;break;case 0xFFD9: // End of codestream (EOC)
break;case 0xFF51: // Image and tile size (SIZ)
length=readUint16(data,position);var siz={};siz.Xsiz=readUint32(data,position+4);siz.Ysiz=readUint32(data,position+8);siz.XOsiz=readUint32(data,position+12);siz.YOsiz=readUint32(data,position+16);siz.XTsiz=readUint32(data,position+20);siz.YTsiz=readUint32(data,position+24);siz.XTOsiz=readUint32(data,position+28);siz.YTOsiz=readUint32(data,position+32);var componentsCount=readUint16(data,position+36);siz.Csiz=componentsCount;var components=[];j=position+38;for(var i=0;i<componentsCount;i++){var component={precision:(data[j]&0x7F)+1,isSigned:!!(data[j]&0x80),XRsiz:data[j+1],YRsiz:data[j+1]};calculateComponentDimensions(component,siz);components.push(component);}context.SIZ=siz;context.components=components;calculateTileGrids(context,components);context.QCC=[];context.COC=[];break;case 0xFF5C: // Quantization default (QCD)
length=readUint16(data,position);var qcd={};j=position+2;sqcd=data[j++];switch(sqcd&0x1F){case 0:spqcdSize=8;scalarExpounded=true;break;case 1:spqcdSize=16;scalarExpounded=false;break;case 2:spqcdSize=16;scalarExpounded=true;break;default:throw new Error('JPX Error: Invalid SQcd value '+sqcd);}qcd.noQuantization=spqcdSize===8;qcd.scalarExpounded=scalarExpounded;qcd.guardBits=sqcd>>5;spqcds=[];while(j<length+position){var spqcd={};if(spqcdSize===8){spqcd.epsilon=data[j++]>>3;spqcd.mu=0;}else {spqcd.epsilon=data[j]>>3;spqcd.mu=(data[j]&0x7)<<8|data[j+1];j+=2;}spqcds.push(spqcd);}qcd.SPqcds=spqcds;if(context.mainHeader){context.QCD=qcd;}else {context.currentTile.QCD=qcd;context.currentTile.QCC=[];}break;case 0xFF5D: // Quantization component (QCC)
length=readUint16(data,position);var qcc={};j=position+2;var cqcc;if(context.SIZ.Csiz<257){cqcc=data[j++];}else {cqcc=readUint16(data,j);j+=2;}sqcd=data[j++];switch(sqcd&0x1F){case 0:spqcdSize=8;scalarExpounded=true;break;case 1:spqcdSize=16;scalarExpounded=false;break;case 2:spqcdSize=16;scalarExpounded=true;break;default:throw new Error('JPX Error: Invalid SQcd value '+sqcd);}qcc.noQuantization=spqcdSize===8;qcc.scalarExpounded=scalarExpounded;qcc.guardBits=sqcd>>5;spqcds=[];while(j<length+position){spqcd={};if(spqcdSize===8){spqcd.epsilon=data[j++]>>3;spqcd.mu=0;}else {spqcd.epsilon=data[j]>>3;spqcd.mu=(data[j]&0x7)<<8|data[j+1];j+=2;}spqcds.push(spqcd);}qcc.SPqcds=spqcds;if(context.mainHeader){context.QCC[cqcc]=qcc;}else {context.currentTile.QCC[cqcc]=qcc;}break;case 0xFF52: // Coding style default (COD)
length=readUint16(data,position);var cod={};j=position+2;var scod=data[j++];cod.entropyCoderWithCustomPrecincts=!!(scod&1);cod.sopMarkerUsed=!!(scod&2);cod.ephMarkerUsed=!!(scod&4);cod.progressionOrder=data[j++];cod.layersCount=readUint16(data,j);j+=2;cod.multipleComponentTransform=data[j++];cod.decompositionLevelsCount=data[j++];cod.xcb=(data[j++]&0xF)+2;cod.ycb=(data[j++]&0xF)+2;var blockStyle=data[j++];cod.selectiveArithmeticCodingBypass=!!(blockStyle&1);cod.resetContextProbabilities=!!(blockStyle&2);cod.terminationOnEachCodingPass=!!(blockStyle&4);cod.verticalyStripe=!!(blockStyle&8);cod.predictableTermination=!!(blockStyle&16);cod.segmentationSymbolUsed=!!(blockStyle&32);cod.reversibleTransformation=data[j++];if(cod.entropyCoderWithCustomPrecincts){var precinctsSizes=[];while(j<length+position){var precinctsSize=data[j++];precinctsSizes.push({PPx:precinctsSize&0xF,PPy:precinctsSize>>4});}cod.precinctsSizes=precinctsSizes;}var unsupported=[];if(cod.selectiveArithmeticCodingBypass){unsupported.push('selectiveArithmeticCodingBypass');}if(cod.resetContextProbabilities){unsupported.push('resetContextProbabilities');}if(cod.terminationOnEachCodingPass){unsupported.push('terminationOnEachCodingPass');}if(cod.verticalyStripe){unsupported.push('verticalyStripe');}if(cod.predictableTermination){unsupported.push('predictableTermination');}if(unsupported.length>0){doNotRecover=true;throw new Error('JPX Error: Unsupported COD options ('+unsupported.join(', ')+')');}if(context.mainHeader){context.COD=cod;}else {context.currentTile.COD=cod;context.currentTile.COC=[];}break;case 0xFF90: // Start of tile-part (SOT)
length=readUint16(data,position);tile={};tile.index=readUint16(data,position+2);tile.length=readUint32(data,position+4);tile.dataEnd=tile.length+position-2;tile.partIndex=data[position+8];tile.partsCount=data[position+9];context.mainHeader=false;if(tile.partIndex===0){ // reset component specific settings
tile.COD=context.COD;tile.COC=context.COC.slice(0); // clone of the global COC
tile.QCD=context.QCD;tile.QCC=context.QCC.slice(0); // clone of the global COC
}context.currentTile=tile;break;case 0xFF93: // Start of data (SOD)
tile=context.currentTile;if(tile.partIndex===0){initializeTile(context,tile.index);buildPackets(context);} // moving to the end of the data
length=tile.dataEnd-position;parseTilePackets(context,data,position,length);break;case 0xFF55: // Tile-part lengths, main header (TLM)
case 0xFF57: // Packet length, main header (PLM)
case 0xFF58: // Packet length, tile-part header (PLT)
case 0xFF64: // Comment (COM)
length=readUint16(data,position); // skipping content
break;case 0xFF53: // Coding style component (COC)
throw new Error('JPX Error: Codestream code 0xFF53 (COC) is '+'not implemented');default:throw new Error('JPX Error: Unknown codestream code: '+code.toString(16));}position+=length;}}catch(e){if(doNotRecover||this.failOnCorruptedImage){throw e;}else {warn('Trying to recover from '+e.message);}}this.tiles=transformComponents(context);this.width=context.SIZ.Xsiz-context.SIZ.XOsiz;this.height=context.SIZ.Ysiz-context.SIZ.YOsiz;this.componentsCount=context.SIZ.Csiz;}};function calculateComponentDimensions(component,siz){ // Section B.2 Component mapping
component.x0=Math.ceil(siz.XOsiz/component.XRsiz);component.x1=Math.ceil(siz.Xsiz/component.XRsiz);component.y0=Math.ceil(siz.YOsiz/component.YRsiz);component.y1=Math.ceil(siz.Ysiz/component.YRsiz);component.width=component.x1-component.x0;component.height=component.y1-component.y0;}function calculateTileGrids(context,components){var siz=context.SIZ; // Section B.3 Division into tile and tile-components
var tile,tiles=[];var numXtiles=Math.ceil((siz.Xsiz-siz.XTOsiz)/siz.XTsiz);var numYtiles=Math.ceil((siz.Ysiz-siz.YTOsiz)/siz.YTsiz);for(var q=0;q<numYtiles;q++){for(var p=0;p<numXtiles;p++){tile={};tile.tx0=Math.max(siz.XTOsiz+p*siz.XTsiz,siz.XOsiz);tile.ty0=Math.max(siz.YTOsiz+q*siz.YTsiz,siz.YOsiz);tile.tx1=Math.min(siz.XTOsiz+(p+1)*siz.XTsiz,siz.Xsiz);tile.ty1=Math.min(siz.YTOsiz+(q+1)*siz.YTsiz,siz.Ysiz);tile.width=tile.tx1-tile.tx0;tile.height=tile.ty1-tile.ty0;tile.components=[];tiles.push(tile);}}context.tiles=tiles;var componentsCount=siz.Csiz;for(var i=0,ii=componentsCount;i<ii;i++){var component=components[i];for(var j=0,jj=tiles.length;j<jj;j++){var tileComponent={};tile=tiles[j];tileComponent.tcx0=Math.ceil(tile.tx0/component.XRsiz);tileComponent.tcy0=Math.ceil(tile.ty0/component.YRsiz);tileComponent.tcx1=Math.ceil(tile.tx1/component.XRsiz);tileComponent.tcy1=Math.ceil(tile.ty1/component.YRsiz);tileComponent.width=tileComponent.tcx1-tileComponent.tcx0;tileComponent.height=tileComponent.tcy1-tileComponent.tcy0;tile.components[i]=tileComponent;}}}function getBlocksDimensions(context,component,r){var codOrCoc=component.codingStyleParameters;var result={};if(!codOrCoc.entropyCoderWithCustomPrecincts){result.PPx=15;result.PPy=15;}else {result.PPx=codOrCoc.precinctsSizes[r].PPx;result.PPy=codOrCoc.precinctsSizes[r].PPy;} // calculate codeblock size as described in section B.7
result.xcb_=r>0?Math.min(codOrCoc.xcb,result.PPx-1):Math.min(codOrCoc.xcb,result.PPx);result.ycb_=r>0?Math.min(codOrCoc.ycb,result.PPy-1):Math.min(codOrCoc.ycb,result.PPy);return result;}function buildPrecincts(context,resolution,dimensions){ // Section B.6 Division resolution to precincts
var precinctWidth=1<<dimensions.PPx;var precinctHeight=1<<dimensions.PPy; // Jasper introduces codeblock groups for mapping each subband codeblocks
// to precincts. Precinct partition divides a resolution according to width
// and height parameters. The subband that belongs to the resolution level
// has a different size than the level, unless it is the zero resolution.
// From Jasper documentation: jpeg2000.pdf, section K: Tier-2 coding:
// The precinct partitioning for a particular subband is derived from a
// partitioning of its parent LL band (i.e., the LL band at the next higher
// resolution level)... The LL band associated with each resolution level is
// divided into precincts... Each of the resulting precinct regions is then
// mapped into its child subbands (if any) at the next lower resolution
// level. This is accomplished by using the coordinate transformation
// (u, v) = (ceil(x/2), ceil(y/2)) where (x, y) and (u, v) are the
// coordinates of a point in the LL band and child subband, respectively.
var isZeroRes=resolution.resLevel===0;var precinctWidthInSubband=1<<dimensions.PPx+(isZeroRes?0:-1);var precinctHeightInSubband=1<<dimensions.PPy+(isZeroRes?0:-1);var numprecinctswide=resolution.trx1>resolution.trx0?Math.ceil(resolution.trx1/precinctWidth)-Math.floor(resolution.trx0/precinctWidth):0;var numprecinctshigh=resolution.try1>resolution.try0?Math.ceil(resolution.try1/precinctHeight)-Math.floor(resolution.try0/precinctHeight):0;var numprecincts=numprecinctswide*numprecinctshigh;resolution.precinctParameters={precinctWidth:precinctWidth,precinctHeight:precinctHeight,numprecinctswide:numprecinctswide,numprecinctshigh:numprecinctshigh,numprecincts:numprecincts,precinctWidthInSubband:precinctWidthInSubband,precinctHeightInSubband:precinctHeightInSubband};}function buildCodeblocks(context,subband,dimensions){ // Section B.7 Division sub-band into code-blocks
var xcb_=dimensions.xcb_;var ycb_=dimensions.ycb_;var codeblockWidth=1<<xcb_;var codeblockHeight=1<<ycb_;var cbx0=subband.tbx0>>xcb_;var cby0=subband.tby0>>ycb_;var cbx1=subband.tbx1+codeblockWidth-1>>xcb_;var cby1=subband.tby1+codeblockHeight-1>>ycb_;var precinctParameters=subband.resolution.precinctParameters;var codeblocks=[];var precincts=[];var i,j,codeblock,precinctNumber;for(j=cby0;j<cby1;j++){for(i=cbx0;i<cbx1;i++){codeblock={cbx:i,cby:j,tbx0:codeblockWidth*i,tby0:codeblockHeight*j,tbx1:codeblockWidth*(i+1),tby1:codeblockHeight*(j+1)};codeblock.tbx0_=Math.max(subband.tbx0,codeblock.tbx0);codeblock.tby0_=Math.max(subband.tby0,codeblock.tby0);codeblock.tbx1_=Math.min(subband.tbx1,codeblock.tbx1);codeblock.tby1_=Math.min(subband.tby1,codeblock.tby1); // Calculate precinct number for this codeblock, codeblock position
// should be relative to its subband, use actual dimension and position
// See comment about codeblock group width and height
var pi=Math.floor((codeblock.tbx0_-subband.tbx0)/precinctParameters.precinctWidthInSubband);var pj=Math.floor((codeblock.tby0_-subband.tby0)/precinctParameters.precinctHeightInSubband);precinctNumber=pi+pj*precinctParameters.numprecinctswide;codeblock.precinctNumber=precinctNumber;codeblock.subbandType=subband.type;codeblock.Lblock=3;if(codeblock.tbx1_<=codeblock.tbx0_||codeblock.tby1_<=codeblock.tby0_){continue;}codeblocks.push(codeblock); // building precinct for the sub-band
var precinct=precincts[precinctNumber];if(precinct!==undefined){if(i<precinct.cbxMin){precinct.cbxMin=i;}else if(i>precinct.cbxMax){precinct.cbxMax=i;}if(j<precinct.cbyMin){precinct.cbxMin=j;}else if(j>precinct.cbyMax){precinct.cbyMax=j;}}else {precincts[precinctNumber]=precinct={cbxMin:i,cbyMin:j,cbxMax:i,cbyMax:j};}codeblock.precinct=precinct;}}subband.codeblockParameters={codeblockWidth:xcb_,codeblockHeight:ycb_,numcodeblockwide:cbx1-cbx0+1,numcodeblockhigh:cby1-cby0+1};subband.codeblocks=codeblocks;subband.precincts=precincts;}function createPacket(resolution,precinctNumber,layerNumber){var precinctCodeblocks=[]; // Section B.10.8 Order of info in packet
var subbands=resolution.subbands; // sub-bands already ordered in 'LL', 'HL', 'LH', and 'HH' sequence
for(var i=0,ii=subbands.length;i<ii;i++){var subband=subbands[i];var codeblocks=subband.codeblocks;for(var j=0,jj=codeblocks.length;j<jj;j++){var codeblock=codeblocks[j];if(codeblock.precinctNumber!==precinctNumber){continue;}precinctCodeblocks.push(codeblock);}}return {layerNumber:layerNumber,codeblocks:precinctCodeblocks};}function LayerResolutionComponentPositionIterator(context){var siz=context.SIZ;var tileIndex=context.currentTile.index;var tile=context.tiles[tileIndex];var layersCount=tile.codingStyleDefaultParameters.layersCount;var componentsCount=siz.Csiz;var maxDecompositionLevelsCount=0;for(var q=0;q<componentsCount;q++){maxDecompositionLevelsCount=Math.max(maxDecompositionLevelsCount,tile.components[q].codingStyleParameters.decompositionLevelsCount);}var l=0,r=0,i=0,k=0;this.nextPacket=function JpxImage_nextPacket(){ // Section B.12.1.1 Layer-resolution-component-position
for(;l<layersCount;l++){for(;r<=maxDecompositionLevelsCount;r++){for(;i<componentsCount;i++){var component=tile.components[i];if(r>component.codingStyleParameters.decompositionLevelsCount){continue;}var resolution=component.resolutions[r];var numprecincts=resolution.precinctParameters.numprecincts;for(;k<numprecincts;){var packet=createPacket(resolution,k,l);k++;return packet;}k=0;}i=0;}r=0;}};}function ResolutionLayerComponentPositionIterator(context){var siz=context.SIZ;var tileIndex=context.currentTile.index;var tile=context.tiles[tileIndex];var layersCount=tile.codingStyleDefaultParameters.layersCount;var componentsCount=siz.Csiz;var maxDecompositionLevelsCount=0;for(var q=0;q<componentsCount;q++){maxDecompositionLevelsCount=Math.max(maxDecompositionLevelsCount,tile.components[q].codingStyleParameters.decompositionLevelsCount);}var r=0,l=0,i=0,k=0;this.nextPacket=function JpxImage_nextPacket(){ // Section B.12.1.2 Resolution-layer-component-position
for(;r<=maxDecompositionLevelsCount;r++){for(;l<layersCount;l++){for(;i<componentsCount;i++){var component=tile.components[i];if(r>component.codingStyleParameters.decompositionLevelsCount){continue;}var resolution=component.resolutions[r];var numprecincts=resolution.precinctParameters.numprecincts;for(;k<numprecincts;){var packet=createPacket(resolution,k,l);k++;return packet;}k=0;}i=0;}l=0;}};}function ResolutionPositionComponentLayerIterator(context){var siz=context.SIZ;var tileIndex=context.currentTile.index;var tile=context.tiles[tileIndex];var layersCount=tile.codingStyleDefaultParameters.layersCount;var componentsCount=siz.Csiz;var l,r,c,p;var maxDecompositionLevelsCount=0;for(c=0;c<componentsCount;c++){var component=tile.components[c];maxDecompositionLevelsCount=Math.max(maxDecompositionLevelsCount,component.codingStyleParameters.decompositionLevelsCount);}var maxNumPrecinctsInLevel=new Int32Array(maxDecompositionLevelsCount+1);for(r=0;r<=maxDecompositionLevelsCount;++r){var maxNumPrecincts=0;for(c=0;c<componentsCount;++c){var resolutions=tile.components[c].resolutions;if(r<resolutions.length){maxNumPrecincts=Math.max(maxNumPrecincts,resolutions[r].precinctParameters.numprecincts);}}maxNumPrecinctsInLevel[r]=maxNumPrecincts;}l=0;r=0;c=0;p=0;this.nextPacket=function JpxImage_nextPacket(){ // Section B.12.1.3 Resolution-position-component-layer
for(;r<=maxDecompositionLevelsCount;r++){for(;p<maxNumPrecinctsInLevel[r];p++){for(;c<componentsCount;c++){var component=tile.components[c];if(r>component.codingStyleParameters.decompositionLevelsCount){continue;}var resolution=component.resolutions[r];var numprecincts=resolution.precinctParameters.numprecincts;if(p>=numprecincts){continue;}for(;l<layersCount;){var packet=createPacket(resolution,p,l);l++;return packet;}l=0;}c=0;}p=0;}};}function PositionComponentResolutionLayerIterator(context){var siz=context.SIZ;var tileIndex=context.currentTile.index;var tile=context.tiles[tileIndex];var layersCount=tile.codingStyleDefaultParameters.layersCount;var componentsCount=siz.Csiz;var precinctsSizes=getPrecinctSizesInImageScale(tile);var precinctsIterationSizes=precinctsSizes;var l=0,r=0,c=0,px=0,py=0;this.nextPacket=function JpxImage_nextPacket(){ // Section B.12.1.4 Position-component-resolution-layer
for(;py<precinctsIterationSizes.maxNumHigh;py++){for(;px<precinctsIterationSizes.maxNumWide;px++){for(;c<componentsCount;c++){var component=tile.components[c];var decompositionLevelsCount=component.codingStyleParameters.decompositionLevelsCount;for(;r<=decompositionLevelsCount;r++){var resolution=component.resolutions[r];var sizeInImageScale=precinctsSizes.components[c].resolutions[r];var k=getPrecinctIndexIfExist(px,py,sizeInImageScale,precinctsIterationSizes,resolution);if(k===null){continue;}for(;l<layersCount;){var packet=createPacket(resolution,k,l);l++;return packet;}l=0;}r=0;}c=0;}px=0;}};}function ComponentPositionResolutionLayerIterator(context){var siz=context.SIZ;var tileIndex=context.currentTile.index;var tile=context.tiles[tileIndex];var layersCount=tile.codingStyleDefaultParameters.layersCount;var componentsCount=siz.Csiz;var precinctsSizes=getPrecinctSizesInImageScale(tile);var l=0,r=0,c=0,px=0,py=0;this.nextPacket=function JpxImage_nextPacket(){ // Section B.12.1.5 Component-position-resolution-layer
for(;c<componentsCount;++c){var component=tile.components[c];var precinctsIterationSizes=precinctsSizes.components[c];var decompositionLevelsCount=component.codingStyleParameters.decompositionLevelsCount;for(;py<precinctsIterationSizes.maxNumHigh;py++){for(;px<precinctsIterationSizes.maxNumWide;px++){for(;r<=decompositionLevelsCount;r++){var resolution=component.resolutions[r];var sizeInImageScale=precinctsIterationSizes.resolutions[r];var k=getPrecinctIndexIfExist(px,py,sizeInImageScale,precinctsIterationSizes,resolution);if(k===null){continue;}for(;l<layersCount;){var packet=createPacket(resolution,k,l);l++;return packet;}l=0;}r=0;}px=0;}py=0;}};}function getPrecinctIndexIfExist(pxIndex,pyIndex,sizeInImageScale,precinctIterationSizes,resolution){var posX=pxIndex*precinctIterationSizes.minWidth;var posY=pyIndex*precinctIterationSizes.minHeight;if(posX%sizeInImageScale.width!==0||posY%sizeInImageScale.height!==0){return null;}var startPrecinctRowIndex=posY/sizeInImageScale.width*resolution.precinctParameters.numprecinctswide;return posX/sizeInImageScale.height+startPrecinctRowIndex;}function getPrecinctSizesInImageScale(tile){var componentsCount=tile.components.length;var minWidth=Number.MAX_VALUE;var minHeight=Number.MAX_VALUE;var maxNumWide=0;var maxNumHigh=0;var sizePerComponent=new Array(componentsCount);for(var c=0;c<componentsCount;c++){var component=tile.components[c];var decompositionLevelsCount=component.codingStyleParameters.decompositionLevelsCount;var sizePerResolution=new Array(decompositionLevelsCount+1);var minWidthCurrentComponent=Number.MAX_VALUE;var minHeightCurrentComponent=Number.MAX_VALUE;var maxNumWideCurrentComponent=0;var maxNumHighCurrentComponent=0;var scale=1;for(var r=decompositionLevelsCount;r>=0;--r){var resolution=component.resolutions[r];var widthCurrentResolution=scale*resolution.precinctParameters.precinctWidth;var heightCurrentResolution=scale*resolution.precinctParameters.precinctHeight;minWidthCurrentComponent=Math.min(minWidthCurrentComponent,widthCurrentResolution);minHeightCurrentComponent=Math.min(minHeightCurrentComponent,heightCurrentResolution);maxNumWideCurrentComponent=Math.max(maxNumWideCurrentComponent,resolution.precinctParameters.numprecinctswide);maxNumHighCurrentComponent=Math.max(maxNumHighCurrentComponent,resolution.precinctParameters.numprecinctshigh);sizePerResolution[r]={width:widthCurrentResolution,height:heightCurrentResolution};scale<<=1;}minWidth=Math.min(minWidth,minWidthCurrentComponent);minHeight=Math.min(minHeight,minHeightCurrentComponent);maxNumWide=Math.max(maxNumWide,maxNumWideCurrentComponent);maxNumHigh=Math.max(maxNumHigh,maxNumHighCurrentComponent);sizePerComponent[c]={resolutions:sizePerResolution,minWidth:minWidthCurrentComponent,minHeight:minHeightCurrentComponent,maxNumWide:maxNumWideCurrentComponent,maxNumHigh:maxNumHighCurrentComponent};}return {components:sizePerComponent,minWidth:minWidth,minHeight:minHeight,maxNumWide:maxNumWide,maxNumHigh:maxNumHigh};}function buildPackets(context){var siz=context.SIZ;var tileIndex=context.currentTile.index;var tile=context.tiles[tileIndex];var componentsCount=siz.Csiz; // Creating resolutions and sub-bands for each component
for(var c=0;c<componentsCount;c++){var component=tile.components[c];var decompositionLevelsCount=component.codingStyleParameters.decompositionLevelsCount; // Section B.5 Resolution levels and sub-bands
var resolutions=[];var subbands=[];for(var r=0;r<=decompositionLevelsCount;r++){var blocksDimensions=getBlocksDimensions(context,component,r);var resolution={};var scale=1<<decompositionLevelsCount-r;resolution.trx0=Math.ceil(component.tcx0/scale);resolution.try0=Math.ceil(component.tcy0/scale);resolution.trx1=Math.ceil(component.tcx1/scale);resolution.try1=Math.ceil(component.tcy1/scale);resolution.resLevel=r;buildPrecincts(context,resolution,blocksDimensions);resolutions.push(resolution);var subband;if(r===0){ // one sub-band (LL) with last decomposition
subband={};subband.type='LL';subband.tbx0=Math.ceil(component.tcx0/scale);subband.tby0=Math.ceil(component.tcy0/scale);subband.tbx1=Math.ceil(component.tcx1/scale);subband.tby1=Math.ceil(component.tcy1/scale);subband.resolution=resolution;buildCodeblocks(context,subband,blocksDimensions);subbands.push(subband);resolution.subbands=[subband];}else {var bscale=1<<decompositionLevelsCount-r+1;var resolutionSubbands=[]; // three sub-bands (HL, LH and HH) with rest of decompositions
subband={};subband.type='HL';subband.tbx0=Math.ceil(component.tcx0/bscale-0.5);subband.tby0=Math.ceil(component.tcy0/bscale);subband.tbx1=Math.ceil(component.tcx1/bscale-0.5);subband.tby1=Math.ceil(component.tcy1/bscale);subband.resolution=resolution;buildCodeblocks(context,subband,blocksDimensions);subbands.push(subband);resolutionSubbands.push(subband);subband={};subband.type='LH';subband.tbx0=Math.ceil(component.tcx0/bscale);subband.tby0=Math.ceil(component.tcy0/bscale-0.5);subband.tbx1=Math.ceil(component.tcx1/bscale);subband.tby1=Math.ceil(component.tcy1/bscale-0.5);subband.resolution=resolution;buildCodeblocks(context,subband,blocksDimensions);subbands.push(subband);resolutionSubbands.push(subband);subband={};subband.type='HH';subband.tbx0=Math.ceil(component.tcx0/bscale-0.5);subband.tby0=Math.ceil(component.tcy0/bscale-0.5);subband.tbx1=Math.ceil(component.tcx1/bscale-0.5);subband.tby1=Math.ceil(component.tcy1/bscale-0.5);subband.resolution=resolution;buildCodeblocks(context,subband,blocksDimensions);subbands.push(subband);resolutionSubbands.push(subband);resolution.subbands=resolutionSubbands;}}component.resolutions=resolutions;component.subbands=subbands;} // Generate the packets sequence
var progressionOrder=tile.codingStyleDefaultParameters.progressionOrder;switch(progressionOrder){case 0:tile.packetsIterator=new LayerResolutionComponentPositionIterator(context);break;case 1:tile.packetsIterator=new ResolutionLayerComponentPositionIterator(context);break;case 2:tile.packetsIterator=new ResolutionPositionComponentLayerIterator(context);break;case 3:tile.packetsIterator=new PositionComponentResolutionLayerIterator(context);break;case 4:tile.packetsIterator=new ComponentPositionResolutionLayerIterator(context);break;default:throw new Error('JPX Error: Unsupported progression order '+progressionOrder);}}function parseTilePackets(context,data,offset,dataLength){var position=0;var buffer,bufferSize=0,skipNextBit=false;function readBits(count){while(bufferSize<count){if(offset+position>=data.length){throw new Error("Unexpected EOF");}var b=data[offset+position];position++;if(skipNextBit){buffer=buffer<<7|b;bufferSize+=7;skipNextBit=false;}else {buffer=buffer<<8|b;bufferSize+=8;}if(b===0xFF){skipNextBit=true;}}bufferSize-=count;return buffer>>>bufferSize&(1<<count)-1;}function skipMarkerIfEqual(value){if(data[offset+position-1]===0xFF&&data[offset+position]===value){skipBytes(1);return true;}else if(data[offset+position]===0xFF&&data[offset+position+1]===value){skipBytes(2);return true;}return false;}function skipBytes(count){position+=count;}function alignToByte(){bufferSize=0;if(skipNextBit){position++;skipNextBit=false;}}function readCodingpasses(){if(readBits(1)===0){return 1;}if(readBits(1)===0){return 2;}var value=readBits(2);if(value<3){return value+3;}value=readBits(5);if(value<31){return value+6;}value=readBits(7);return value+37;}var tileIndex=context.currentTile.index;var tile=context.tiles[tileIndex];var sopMarkerUsed=context.COD.sopMarkerUsed;var ephMarkerUsed=context.COD.ephMarkerUsed;var packetsIterator=tile.packetsIterator;while(position<dataLength){try{alignToByte();if(sopMarkerUsed&&skipMarkerIfEqual(0x91)){ // Skip also marker segment length and packet sequence ID
skipBytes(4);}var packet=packetsIterator.nextPacket();if(packet===undefined){ //No more packets. Stream is probably truncated.
return;}if(!readBits(1)){continue;}var layerNumber=packet.layerNumber;var queue=[],codeblock;for(var i=0,ii=packet.codeblocks.length;i<ii;i++){codeblock=packet.codeblocks[i];var precinct=codeblock.precinct;var codeblockColumn=codeblock.cbx-precinct.cbxMin;var codeblockRow=codeblock.cby-precinct.cbyMin;var codeblockIncluded=false;var firstTimeInclusion=false;var valueReady;if(codeblock['included']!==undefined){codeblockIncluded=!!readBits(1);}else { // reading inclusion tree
precinct=codeblock.precinct;var inclusionTree,zeroBitPlanesTree;if(precinct['inclusionTree']!==undefined){inclusionTree=precinct.inclusionTree;}else { // building inclusion and zero bit-planes trees
var width=precinct.cbxMax-precinct.cbxMin+1;var height=precinct.cbyMax-precinct.cbyMin+1;inclusionTree=new InclusionTree(width,height);zeroBitPlanesTree=new TagTree(width,height);precinct.inclusionTree=inclusionTree;precinct.zeroBitPlanesTree=zeroBitPlanesTree;}inclusionTree.reset(codeblockColumn,codeblockRow,layerNumber);while(true){if(position>=data.length){return;}if(inclusionTree.isAboveThreshold()){break;}if(inclusionTree.isKnown()){inclusionTree.nextLevel();continue;}if(readBits(1)){inclusionTree.setKnown();if(inclusionTree.isLeaf()){codeblock.included=true;codeblockIncluded=firstTimeInclusion=true;break;}else {inclusionTree.nextLevel();}}else {inclusionTree.incrementValue();}}}if(!codeblockIncluded){continue;}if(firstTimeInclusion){zeroBitPlanesTree=precinct.zeroBitPlanesTree;zeroBitPlanesTree.reset(codeblockColumn,codeblockRow);while(true){if(position>=data.length){return;}if(readBits(1)){valueReady=!zeroBitPlanesTree.nextLevel();if(valueReady){break;}}else {zeroBitPlanesTree.incrementValue();}}codeblock.zeroBitPlanes=zeroBitPlanesTree.value;}var codingpasses=readCodingpasses();while(readBits(1)){codeblock.Lblock++;}var codingpassesLog2=log2(codingpasses); // rounding down log2
var bits=(codingpasses<1<<codingpassesLog2?codingpassesLog2-1:codingpassesLog2)+codeblock.Lblock;var codedDataLength=readBits(bits);queue.push({codeblock:codeblock,codingpasses:codingpasses,dataLength:codedDataLength});}alignToByte();if(ephMarkerUsed){skipMarkerIfEqual(0x92);}while(queue.length>0){var packetItem=queue.shift();codeblock=packetItem.codeblock;if(codeblock['data']===undefined){codeblock.data=[];}codeblock.data.push({data:data,start:offset+position,end:offset+position+packetItem.dataLength,codingpasses:packetItem.codingpasses});position+=packetItem.dataLength;}}catch(e){return;}}return position;}function copyCoefficients(coefficients,levelWidth,levelHeight,subband,delta,mb,reversible,segmentationSymbolUsed){var x0=subband.tbx0;var y0=subband.tby0;var width=subband.tbx1-subband.tbx0;var codeblocks=subband.codeblocks;var right=subband.type.charAt(0)==='H'?1:0;var bottom=subband.type.charAt(1)==='H'?levelWidth:0;for(var i=0,ii=codeblocks.length;i<ii;++i){var codeblock=codeblocks[i];var blockWidth=codeblock.tbx1_-codeblock.tbx0_;var blockHeight=codeblock.tby1_-codeblock.tby0_;if(blockWidth===0||blockHeight===0){continue;}if(codeblock['data']===undefined){continue;}var bitModel,currentCodingpassType;bitModel=new BitModel(blockWidth,blockHeight,codeblock.subbandType,codeblock.zeroBitPlanes,mb);currentCodingpassType=2; // first bit plane starts from cleanup
// collect data
var data=codeblock.data,totalLength=0,codingpasses=0;var j,jj,dataItem;for(j=0,jj=data.length;j<jj;j++){dataItem=data[j];totalLength+=dataItem.end-dataItem.start;codingpasses+=dataItem.codingpasses;}var encodedData=new Int16Array(totalLength);var position=0;for(j=0,jj=data.length;j<jj;j++){dataItem=data[j];var chunk=dataItem.data.subarray(dataItem.start,dataItem.end);encodedData.set(chunk,position);position+=chunk.length;} // decoding the item
var decoder=new ArithmeticDecoder(encodedData,0,totalLength);bitModel.setDecoder(decoder);for(j=0;j<codingpasses;j++){switch(currentCodingpassType){case 0:bitModel.runSignificancePropogationPass();break;case 1:bitModel.runMagnitudeRefinementPass();break;case 2:bitModel.runCleanupPass();if(segmentationSymbolUsed){bitModel.checkSegmentationSymbol();}break;}currentCodingpassType=(currentCodingpassType+1)%3;}var offset=codeblock.tbx0_-x0+(codeblock.tby0_-y0)*width;var sign=bitModel.coefficentsSign;var magnitude=bitModel.coefficentsMagnitude;var bitsDecoded=bitModel.bitsDecoded;var magnitudeCorrection=reversible?0:0.5;var k,n,nb;position=0; // Do the interleaving of Section F.3.3 here, so we do not need
// to copy later. LL level is not interleaved, just copied.
var interleave=subband.type!=='LL';for(j=0;j<blockHeight;j++){var row=offset/width|0; // row in the non-interleaved subband
var levelOffset=2*row*(levelWidth-width)+right+bottom;for(k=0;k<blockWidth;k++){n=magnitude[position];if(n!==0){n=(n+magnitudeCorrection)*delta;if(sign[position]!==0){n=-n;}nb=bitsDecoded[position];var pos=interleave?levelOffset+(offset<<1):offset;if(reversible&&nb>=mb){coefficients[pos]=n;}else {coefficients[pos]=n*(1<<mb-nb);}}offset++;position++;}offset+=width-blockWidth;}}}function transformTile(context,tile,c){var component=tile.components[c];var codingStyleParameters=component.codingStyleParameters;var quantizationParameters=component.quantizationParameters;var decompositionLevelsCount=codingStyleParameters.decompositionLevelsCount;var spqcds=quantizationParameters.SPqcds;var scalarExpounded=quantizationParameters.scalarExpounded;var guardBits=quantizationParameters.guardBits;var segmentationSymbolUsed=codingStyleParameters.segmentationSymbolUsed;var precision=context.components[c].precision;var reversible=codingStyleParameters.reversibleTransformation;var transform=reversible?new ReversibleTransform():new IrreversibleTransform();var subbandCoefficients=[];var b=0;for(var i=0;i<=decompositionLevelsCount;i++){var resolution=component.resolutions[i];var width=resolution.trx1-resolution.trx0;var height=resolution.try1-resolution.try0; // Allocate space for the whole sublevel.
var coefficients=new Float32Array(width*height);for(var j=0,jj=resolution.subbands.length;j<jj;j++){var mu,epsilon;if(!scalarExpounded){ // formula E-5
mu=spqcds[0].mu;epsilon=spqcds[0].epsilon+(i>0?1-i:0);}else {mu=spqcds[b].mu;epsilon=spqcds[b].epsilon;b++;}var subband=resolution.subbands[j];var gainLog2=SubbandsGainLog2[subband.type]; // calulate quantization coefficient (Section E.1.1.1)
var delta=reversible?1:Math.pow(2,precision+gainLog2-epsilon)*(1+mu/2048);var mb=guardBits+epsilon-1; // In the first resolution level, copyCoefficients will fill the
// whole array with coefficients. In the succeding passes,
// copyCoefficients will consecutively fill in the values that belong
// to the interleaved positions of the HL, LH, and HH coefficients.
// The LL coefficients will then be interleaved in Transform.iterate().
copyCoefficients(coefficients,width,height,subband,delta,mb,reversible,segmentationSymbolUsed);}subbandCoefficients.push({width:width,height:height,items:coefficients});}var result=transform.calculate(subbandCoefficients,component.tcx0,component.tcy0);return {left:component.tcx0,top:component.tcy0,width:result.width,height:result.height,items:result.items};}function transformComponents(context){var siz=context.SIZ;var components=context.components;var componentsCount=siz.Csiz;var resultImages=[];for(var i=0,ii=context.tiles.length;i<ii;i++){var tile=context.tiles[i];var transformedTiles=[];var c;for(c=0;c<componentsCount;c++){transformedTiles[c]=transformTile(context,tile,c);}var tile0=transformedTiles[0];var isSigned=components[0].isSigned;if(isSigned){var out=new Int16Array(tile0.items.length*componentsCount);}else {var out=new Uint16Array(tile0.items.length*componentsCount);}var result={left:tile0.left,top:tile0.top,width:tile0.width,height:tile0.height,items:out}; // Section G.2.2 Inverse multi component transform
var shift,offset,max,min,maxK;var pos=0,j,jj,y0,y1,y2,r,g,b,k,val;if(tile.codingStyleDefaultParameters.multipleComponentTransform){var fourComponents=componentsCount===4;var y0items=transformedTiles[0].items;var y1items=transformedTiles[1].items;var y2items=transformedTiles[2].items;var y3items=fourComponents?transformedTiles[3].items:null; // HACK: The multiple component transform formulas below assume that
// all components have the same precision. With this in mind, we
// compute shift and offset only once.
shift=components[0].precision-8;offset=(128<<shift)+0.5;max=255*(1<<shift);maxK=max*0.5;min=-maxK;var component0=tile.components[0];var alpha01=componentsCount-3;jj=y0items.length;if(!component0.codingStyleParameters.reversibleTransformation){ // inverse irreversible multiple component transform
for(j=0;j<jj;j++,pos+=alpha01){y0=y0items[j]+offset;y1=y1items[j];y2=y2items[j];r=y0+1.402*y2;g=y0-0.34413*y1-0.71414*y2;b=y0+1.772*y1;out[pos++]=r<=0?0:r>=max?255:r>>shift;out[pos++]=g<=0?0:g>=max?255:g>>shift;out[pos++]=b<=0?0:b>=max?255:b>>shift;}}else { // inverse reversible multiple component transform
for(j=0;j<jj;j++,pos+=alpha01){y0=y0items[j]+offset;y1=y1items[j];y2=y2items[j];g=y0-(y2+y1>>2);r=g+y2;b=g+y1;out[pos++]=r<=0?0:r>=max?255:r>>shift;out[pos++]=g<=0?0:g>=max?255:g>>shift;out[pos++]=b<=0?0:b>=max?255:b>>shift;}}if(fourComponents){for(j=0,pos=3;j<jj;j++,pos+=4){k=y3items[j];out[pos]=k<=min?0:k>=maxK?255:k+offset>>shift;}}}else { // no multi-component transform
for(c=0;c<componentsCount;c++){if(components[c].precision===8){var items=transformedTiles[c].items;shift=components[c].precision-8;offset=(128<<shift)+0.5;max=127.5*(1<<shift);min=-max;for(pos=c,j=0,jj=items.length;j<jj;j++){val=items[j];out[pos]=val<=min?0:val>=max?255:val+offset>>shift;pos+=componentsCount;}}else {var isSigned=components[c].isSigned;var items=transformedTiles[c].items;if(isSigned){for(pos=c,j=0,jj=items.length;j<jj;j++){out[pos]=items[j];pos+=componentsCount;}}else {shift=components[c].precision-8;offset=(128<<shift)+0.5;var precisionMax=Math.pow(2,components[c].precision)-1;for(pos=c,j=0,jj=items.length;j<jj;j++){val=items[j];out[pos]=Math.max(Math.min(val+offset,precisionMax),0);pos+=componentsCount;}}}}}resultImages.push(result);}return resultImages;}function initializeTile(context,tileIndex){var siz=context.SIZ;var componentsCount=siz.Csiz;var tile=context.tiles[tileIndex];for(var c=0;c<componentsCount;c++){var component=tile.components[c];var qcdOrQcc=context.currentTile.QCC[c]!==undefined?context.currentTile.QCC[c]:context.currentTile.QCD;component.quantizationParameters=qcdOrQcc;var codOrCoc=context.currentTile.COC[c]!==undefined?context.currentTile.COC[c]:context.currentTile.COD;component.codingStyleParameters=codOrCoc;}tile.codingStyleDefaultParameters=context.currentTile.COD;} // Section B.10.2 Tag trees
var TagTree=function TagTreeClosure(){function TagTree(width,height){var levelsLength=log2(Math.max(width,height))+1;this.levels=[];for(var i=0;i<levelsLength;i++){var level={width:width,height:height,items:[]};this.levels.push(level);width=Math.ceil(width/2);height=Math.ceil(height/2);}}TagTree.prototype={reset:function TagTree_reset(i,j){var currentLevel=0,value=0,level;while(currentLevel<this.levels.length){level=this.levels[currentLevel];var index=i+j*level.width;if(level.items[index]!==undefined){value=level.items[index];break;}level.index=index;i>>=1;j>>=1;currentLevel++;}currentLevel--;level=this.levels[currentLevel];level.items[level.index]=value;this.currentLevel=currentLevel;delete this.value;},incrementValue:function TagTree_incrementValue(){var level=this.levels[this.currentLevel];level.items[level.index]++;},nextLevel:function TagTree_nextLevel(){var currentLevel=this.currentLevel;var level=this.levels[currentLevel];var value=level.items[level.index];currentLevel--;if(currentLevel<0){this.value=value;return false;}this.currentLevel=currentLevel;level=this.levels[currentLevel];level.items[level.index]=value;return true;}};return TagTree;}();var InclusionTree=function InclusionTreeClosure(){function InclusionTree(width,height){var levelsLength=log2(Math.max(width,height))+1;this.levels=[];for(var i=0;i<levelsLength;i++){var items=new Uint8Array(width*height);var status=new Uint8Array(width*height);for(var j=0,jj=items.length;j<jj;j++){items[j]=0;status[j]=0;}var level={width:width,height:height,items:items,status:status};this.levels.push(level);width=Math.ceil(width/2);height=Math.ceil(height/2);}}InclusionTree.prototype={reset:function InclusionTree_reset(i,j,stopValue){this.currentStopValue=stopValue;var currentLevel=0;while(currentLevel<this.levels.length){var level=this.levels[currentLevel];var index=i+j*level.width;level.index=index;i>>=1;j>>=1;currentLevel++;}this.currentLevel=this.levels.length-1;this.minValue=this.levels[this.currentLevel].items[0];return;},incrementValue:function InclusionTree_incrementValue(){var level=this.levels[this.currentLevel];level.items[level.index]=level.items[level.index]+1;if(level.items[level.index]>this.minValue){this.minValue=level.items[level.index];}},nextLevel:function InclusionTree_nextLevel(){var currentLevel=this.currentLevel;currentLevel--;if(currentLevel<0){return false;}else {this.currentLevel=currentLevel;var level=this.levels[currentLevel];if(level.items[level.index]<this.minValue){level.items[level.index]=this.minValue;}else if(level.items[level.index]>this.minValue){this.minValue=level.items[level.index];}return true;}},isLeaf:function InclusionTree_isLeaf(){return this.currentLevel===0;},isAboveThreshold:function InclusionTree_isAboveThreshold(){var levelindex=this.currentLevel;var level=this.levels[levelindex];return level.items[level.index]>this.currentStopValue;},isKnown:function InclusionTree_isKnown(){var levelindex=this.currentLevel;var level=this.levels[levelindex];return level.status[level.index]>0;},setKnown:function InclusionTree_setKnown(){var levelindex=this.currentLevel;var level=this.levels[levelindex];level.status[level.index]=1;return;}};return InclusionTree;}(); // Section D. Coefficient bit modeling
var BitModel=function BitModelClosure(){var UNIFORM_CONTEXT=17;var RUNLENGTH_CONTEXT=18; // Table D-1
// The index is binary presentation: 0dddvvhh, ddd - sum of Di (0..4),
// vv - sum of Vi (0..2), and hh - sum of Hi (0..2)
var LLAndLHContextsLabel=new Uint8Array([0,5,8,0,3,7,8,0,4,7,8,0,0,0,0,0,1,6,8,0,3,7,8,0,4,7,8,0,0,0,0,0,2,6,8,0,3,7,8,0,4,7,8,0,0,0,0,0,2,6,8,0,3,7,8,0,4,7,8,0,0,0,0,0,2,6,8,0,3,7,8,0,4,7,8]);var HLContextLabel=new Uint8Array([0,3,4,0,5,7,7,0,8,8,8,0,0,0,0,0,1,3,4,0,6,7,7,0,8,8,8,0,0,0,0,0,2,3,4,0,6,7,7,0,8,8,8,0,0,0,0,0,2,3,4,0,6,7,7,0,8,8,8,0,0,0,0,0,2,3,4,0,6,7,7,0,8,8,8]);var HHContextLabel=new Uint8Array([0,1,2,0,1,2,2,0,2,2,2,0,0,0,0,0,3,4,5,0,4,5,5,0,5,5,5,0,0,0,0,0,6,7,7,0,7,7,7,0,7,7,7,0,0,0,0,0,8,8,8,0,8,8,8,0,8,8,8,0,0,0,0,0,8,8,8,0,8,8,8,0,8,8,8]);function BitModel(width,height,subband,zeroBitPlanes,mb){this.width=width;this.height=height;this.contextLabelTable=subband==='HH'?HHContextLabel:subband==='HL'?HLContextLabel:LLAndLHContextsLabel;var coefficientCount=width*height; // coefficients outside the encoding region treated as insignificant
// add border state cells for significanceState
this.neighborsSignificance=new Uint8Array(coefficientCount);this.coefficentsSign=new Uint8Array(coefficientCount);this.coefficentsMagnitude=mb>14?new Uint32Array(coefficientCount):mb>6?new Uint16Array(coefficientCount):new Uint8Array(coefficientCount);this.processingFlags=new Uint8Array(coefficientCount);var bitsDecoded=new Uint8Array(coefficientCount);if(zeroBitPlanes!==0){for(var i=0;i<coefficientCount;i++){bitsDecoded[i]=zeroBitPlanes;}}this.bitsDecoded=bitsDecoded;this.reset();}BitModel.prototype={setDecoder:function BitModel_setDecoder(decoder){this.decoder=decoder;},reset:function BitModel_reset(){ // We have 17 contexts that are accessed via context labels,
// plus the uniform and runlength context.
this.contexts=new Int8Array(19); // Contexts are packed into 1 byte:
// highest 7 bits carry the index, lowest bit carries mps
this.contexts[0]=4<<1|0;this.contexts[UNIFORM_CONTEXT]=46<<1|0;this.contexts[RUNLENGTH_CONTEXT]=3<<1|0;},setNeighborsSignificance:function BitModel_setNeighborsSignificance(row,column,index){var neighborsSignificance=this.neighborsSignificance;var width=this.width,height=this.height;var left=column>0;var right=column+1<width;var i;if(row>0){i=index-width;if(left){neighborsSignificance[i-1]+=0x10;}if(right){neighborsSignificance[i+1]+=0x10;}neighborsSignificance[i]+=0x04;}if(row+1<height){i=index+width;if(left){neighborsSignificance[i-1]+=0x10;}if(right){neighborsSignificance[i+1]+=0x10;}neighborsSignificance[i]+=0x04;}if(left){neighborsSignificance[index-1]+=0x01;}if(right){neighborsSignificance[index+1]+=0x01;}neighborsSignificance[index]|=0x80;},runSignificancePropogationPass:function BitModel_runSignificancePropogationPass(){var decoder=this.decoder;var width=this.width,height=this.height;var coefficentsMagnitude=this.coefficentsMagnitude;var coefficentsSign=this.coefficentsSign;var neighborsSignificance=this.neighborsSignificance;var processingFlags=this.processingFlags;var contexts=this.contexts;var labels=this.contextLabelTable;var bitsDecoded=this.bitsDecoded;var processedInverseMask=~1;var processedMask=1;var firstMagnitudeBitMask=2;for(var i0=0;i0<height;i0+=4){for(var j=0;j<width;j++){var index=i0*width+j;for(var i1=0;i1<4;i1++,index+=width){var i=i0+i1;if(i>=height){break;} // clear processed flag first
processingFlags[index]&=processedInverseMask;if(coefficentsMagnitude[index]||!neighborsSignificance[index]){continue;}var contextLabel=labels[neighborsSignificance[index]];var decision=decoder.readBit(contexts,contextLabel);if(decision){var sign=this.decodeSignBit(i,j,index);coefficentsSign[index]=sign;coefficentsMagnitude[index]=1;this.setNeighborsSignificance(i,j,index);processingFlags[index]|=firstMagnitudeBitMask;}bitsDecoded[index]++;processingFlags[index]|=processedMask;}}}},decodeSignBit:function BitModel_decodeSignBit(row,column,index){var width=this.width,height=this.height;var coefficentsMagnitude=this.coefficentsMagnitude;var coefficentsSign=this.coefficentsSign;var contribution,sign0,sign1,significance1;var contextLabel,decoded; // calculate horizontal contribution
significance1=column>0&&coefficentsMagnitude[index-1]!==0;if(column+1<width&&coefficentsMagnitude[index+1]!==0){sign1=coefficentsSign[index+1];if(significance1){sign0=coefficentsSign[index-1];contribution=1-sign1-sign0;}else {contribution=1-sign1-sign1;}}else if(significance1){sign0=coefficentsSign[index-1];contribution=1-sign0-sign0;}else {contribution=0;}var horizontalContribution=3*contribution; // calculate vertical contribution and combine with the horizontal
significance1=row>0&&coefficentsMagnitude[index-width]!==0;if(row+1<height&&coefficentsMagnitude[index+width]!==0){sign1=coefficentsSign[index+width];if(significance1){sign0=coefficentsSign[index-width];contribution=1-sign1-sign0+horizontalContribution;}else {contribution=1-sign1-sign1+horizontalContribution;}}else if(significance1){sign0=coefficentsSign[index-width];contribution=1-sign0-sign0+horizontalContribution;}else {contribution=horizontalContribution;}if(contribution>=0){contextLabel=9+contribution;decoded=this.decoder.readBit(this.contexts,contextLabel);}else {contextLabel=9-contribution;decoded=this.decoder.readBit(this.contexts,contextLabel)^1;}return decoded;},runMagnitudeRefinementPass:function BitModel_runMagnitudeRefinementPass(){var decoder=this.decoder;var width=this.width,height=this.height;var coefficentsMagnitude=this.coefficentsMagnitude;var neighborsSignificance=this.neighborsSignificance;var contexts=this.contexts;var bitsDecoded=this.bitsDecoded;var processingFlags=this.processingFlags;var processedMask=1;var firstMagnitudeBitMask=2;var length=width*height;var width4=width*4;for(var index0=0,indexNext;index0<length;index0=indexNext){indexNext=Math.min(length,index0+width4);for(var j=0;j<width;j++){for(var index=index0+j;index<indexNext;index+=width){ // significant but not those that have just become
if(!coefficentsMagnitude[index]||(processingFlags[index]&processedMask)!==0){continue;}var contextLabel=16;if((processingFlags[index]&firstMagnitudeBitMask)!==0){processingFlags[index]^=firstMagnitudeBitMask; // first refinement
var significance=neighborsSignificance[index]&127;contextLabel=significance===0?15:14;}var bit=decoder.readBit(contexts,contextLabel);coefficentsMagnitude[index]=coefficentsMagnitude[index]<<1|bit;bitsDecoded[index]++;processingFlags[index]|=processedMask;}}}},runCleanupPass:function BitModel_runCleanupPass(){var decoder=this.decoder;var width=this.width,height=this.height;var neighborsSignificance=this.neighborsSignificance;var coefficentsMagnitude=this.coefficentsMagnitude;var coefficentsSign=this.coefficentsSign;var contexts=this.contexts;var labels=this.contextLabelTable;var bitsDecoded=this.bitsDecoded;var processingFlags=this.processingFlags;var processedMask=1;var firstMagnitudeBitMask=2;var oneRowDown=width;var twoRowsDown=width*2;var threeRowsDown=width*3;var iNext;for(var i0=0;i0<height;i0=iNext){iNext=Math.min(i0+4,height);var indexBase=i0*width;var checkAllEmpty=i0+3<height;for(var j=0;j<width;j++){var index0=indexBase+j; // using the property: labels[neighborsSignificance[index]] === 0
// when neighborsSignificance[index] === 0
var allEmpty=checkAllEmpty&&processingFlags[index0]===0&&processingFlags[index0+oneRowDown]===0&&processingFlags[index0+twoRowsDown]===0&&processingFlags[index0+threeRowsDown]===0&&neighborsSignificance[index0]===0&&neighborsSignificance[index0+oneRowDown]===0&&neighborsSignificance[index0+twoRowsDown]===0&&neighborsSignificance[index0+threeRowsDown]===0;var i1=0,index=index0;var i=i0,sign;if(allEmpty){var hasSignificantCoefficent=decoder.readBit(contexts,RUNLENGTH_CONTEXT);if(!hasSignificantCoefficent){bitsDecoded[index0]++;bitsDecoded[index0+oneRowDown]++;bitsDecoded[index0+twoRowsDown]++;bitsDecoded[index0+threeRowsDown]++;continue; // next column
}i1=decoder.readBit(contexts,UNIFORM_CONTEXT)<<1|decoder.readBit(contexts,UNIFORM_CONTEXT);if(i1!==0){i=i0+i1;index+=i1*width;}sign=this.decodeSignBit(i,j,index);coefficentsSign[index]=sign;coefficentsMagnitude[index]=1;this.setNeighborsSignificance(i,j,index);processingFlags[index]|=firstMagnitudeBitMask;index=index0;for(var i2=i0;i2<=i;i2++,index+=width){bitsDecoded[index]++;}i1++;}for(i=i0+i1;i<iNext;i++,index+=width){if(coefficentsMagnitude[index]||(processingFlags[index]&processedMask)!==0){continue;}var contextLabel=labels[neighborsSignificance[index]];var decision=decoder.readBit(contexts,contextLabel);if(decision===1){sign=this.decodeSignBit(i,j,index);coefficentsSign[index]=sign;coefficentsMagnitude[index]=1;this.setNeighborsSignificance(i,j,index);processingFlags[index]|=firstMagnitudeBitMask;}bitsDecoded[index]++;}}}},checkSegmentationSymbol:function BitModel_checkSegmentationSymbol(){var decoder=this.decoder;var contexts=this.contexts;var symbol=decoder.readBit(contexts,UNIFORM_CONTEXT)<<3|decoder.readBit(contexts,UNIFORM_CONTEXT)<<2|decoder.readBit(contexts,UNIFORM_CONTEXT)<<1|decoder.readBit(contexts,UNIFORM_CONTEXT);if(symbol!==0xA){throw new Error('JPX Error: Invalid segmentation symbol');}}};return BitModel;}(); // Section F, Discrete wavelet transformation
var Transform=function TransformClosure(){function Transform(){}Transform.prototype.calculate=function transformCalculate(subbands,u0,v0){var ll=subbands[0];for(var i=1,ii=subbands.length;i<ii;i++){ll=this.iterate(ll,subbands[i],u0,v0);}return ll;};Transform.prototype.extend=function extend(buffer,offset,size){ // Section F.3.7 extending... using max extension of 4
var i1=offset-1,j1=offset+1;var i2=offset+size-2,j2=offset+size;buffer[i1--]=buffer[j1++];buffer[j2++]=buffer[i2--];buffer[i1--]=buffer[j1++];buffer[j2++]=buffer[i2--];buffer[i1--]=buffer[j1++];buffer[j2++]=buffer[i2--];buffer[i1]=buffer[j1];buffer[j2]=buffer[i2];};Transform.prototype.iterate=function Transform_iterate(ll,hl_lh_hh,u0,v0){var llWidth=ll.width,llHeight=ll.height,llItems=ll.items;var width=hl_lh_hh.width;var height=hl_lh_hh.height;var items=hl_lh_hh.items;var i,j,k,l,u,v; // Interleave LL according to Section F.3.3
for(k=0,i=0;i<llHeight;i++){l=i*2*width;for(j=0;j<llWidth;j++,k++,l+=2){items[l]=llItems[k];}} // The LL band is not needed anymore.
llItems=ll.items=null;var bufferPadding=4;var rowBuffer=new Float32Array(width+2*bufferPadding); // Section F.3.4 HOR_SR
if(width===1){ // if width = 1, when u0 even keep items as is, when odd divide by 2
if((u0&1)!==0){for(v=0,k=0;v<height;v++,k+=width){items[k]*=0.5;}}}else {for(v=0,k=0;v<height;v++,k+=width){rowBuffer.set(items.subarray(k,k+width),bufferPadding);this.extend(rowBuffer,bufferPadding,width);this.filter(rowBuffer,bufferPadding,width);items.set(rowBuffer.subarray(bufferPadding,bufferPadding+width),k);}} // Accesses to the items array can take long, because it may not fit into
// CPU cache and has to be fetched from main memory. Since subsequent
// accesses to the items array are not local when reading columns, we
// have a cache miss every time. To reduce cache misses, get up to
// 'numBuffers' items at a time and store them into the individual
// buffers. The colBuffers should be small enough to fit into CPU cache.
var numBuffers=16;var colBuffers=[];for(i=0;i<numBuffers;i++){colBuffers.push(new Float32Array(height+2*bufferPadding));}var b,currentBuffer=0;ll=bufferPadding+height; // Section F.3.5 VER_SR
if(height===1){ // if height = 1, when v0 even keep items as is, when odd divide by 2
if((v0&1)!==0){for(u=0;u<width;u++){items[u]*=0.5;}}}else {for(u=0;u<width;u++){ // if we ran out of buffers, copy several image columns at once
if(currentBuffer===0){numBuffers=Math.min(width-u,numBuffers);for(k=u,l=bufferPadding;l<ll;k+=width,l++){for(b=0;b<numBuffers;b++){colBuffers[b][l]=items[k+b];}}currentBuffer=numBuffers;}currentBuffer--;var buffer=colBuffers[currentBuffer];this.extend(buffer,bufferPadding,height);this.filter(buffer,bufferPadding,height); // If this is last buffer in this group of buffers, flush all buffers.
if(currentBuffer===0){k=u-numBuffers+1;for(l=bufferPadding;l<ll;k+=width,l++){for(b=0;b<numBuffers;b++){items[k+b]=colBuffers[b][l];}}}}}return {width:width,height:height,items:items};};return Transform;}(); // Section 3.8.2 Irreversible 9-7 filter
var IrreversibleTransform=function IrreversibleTransformClosure(){function IrreversibleTransform(){Transform.call(this);}IrreversibleTransform.prototype=Object.create(Transform.prototype);IrreversibleTransform.prototype.filter=function irreversibleTransformFilter(x,offset,length){var len=length>>1;offset=offset|0;var j,n,current,next;var alpha=-1.586134342059924;var beta=-0.052980118572961;var gamma=0.882911075530934;var delta=0.443506852043971;var K=1.230174104914001;var K_=1/K; // step 1 is combined with step 3
// step 2
j=offset-3;for(n=len+4;n--;j+=2){x[j]*=K_;} // step 1 & 3
j=offset-2;current=delta*x[j-1];for(n=len+3;n--;j+=2){next=delta*x[j+1];x[j]=K*x[j]-current-next;if(n--){j+=2;current=delta*x[j+1];x[j]=K*x[j]-current-next;}else {break;}} // step 4
j=offset-1;current=gamma*x[j-1];for(n=len+2;n--;j+=2){next=gamma*x[j+1];x[j]-=current+next;if(n--){j+=2;current=gamma*x[j+1];x[j]-=current+next;}else {break;}} // step 5
j=offset;current=beta*x[j-1];for(n=len+1;n--;j+=2){next=beta*x[j+1];x[j]-=current+next;if(n--){j+=2;current=beta*x[j+1];x[j]-=current+next;}else {break;}} // step 6
if(len!==0){j=offset+1;current=alpha*x[j-1];for(n=len;n--;j+=2){next=alpha*x[j+1];x[j]-=current+next;if(n--){j+=2;current=alpha*x[j+1];x[j]-=current+next;}else {break;}}}};return IrreversibleTransform;}(); // Section 3.8.1 Reversible 5-3 filter
var ReversibleTransform=function ReversibleTransformClosure(){function ReversibleTransform(){Transform.call(this);}ReversibleTransform.prototype=Object.create(Transform.prototype);ReversibleTransform.prototype.filter=function reversibleTransformFilter(x,offset,length){var len=length>>1;offset=offset|0;var j,n;for(j=offset,n=len+1;n--;j+=2){x[j]-=x[j-1]+x[j+1]+2>>2;}for(j=offset+1,n=len;n--;j+=2){x[j]+=x[j-1]+x[j+1]>>1;}};return ReversibleTransform;}();return JpxImage;}(); /* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */ /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */ /* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */'use strict'; /* This class implements the QM Coder decoding as defined in
 *   JPEG 2000 Part I Final Committee Draft Version 1.0
 *   Annex C.3 Arithmetic decoding procedure 
 * available at http://www.jpeg.org/public/fcd15444-1.pdf
 * 
 * The arithmetic decoder is used in conjunction with context models to decode
 * JPEG2000 and JBIG2 streams.
 */var ArithmeticDecoder=function ArithmeticDecoderClosure(){ // Table C-2
var QeTable=[{qe:0x5601,nmps:1,nlps:1,switchFlag:1},{qe:0x3401,nmps:2,nlps:6,switchFlag:0},{qe:0x1801,nmps:3,nlps:9,switchFlag:0},{qe:0x0AC1,nmps:4,nlps:12,switchFlag:0},{qe:0x0521,nmps:5,nlps:29,switchFlag:0},{qe:0x0221,nmps:38,nlps:33,switchFlag:0},{qe:0x5601,nmps:7,nlps:6,switchFlag:1},{qe:0x5401,nmps:8,nlps:14,switchFlag:0},{qe:0x4801,nmps:9,nlps:14,switchFlag:0},{qe:0x3801,nmps:10,nlps:14,switchFlag:0},{qe:0x3001,nmps:11,nlps:17,switchFlag:0},{qe:0x2401,nmps:12,nlps:18,switchFlag:0},{qe:0x1C01,nmps:13,nlps:20,switchFlag:0},{qe:0x1601,nmps:29,nlps:21,switchFlag:0},{qe:0x5601,nmps:15,nlps:14,switchFlag:1},{qe:0x5401,nmps:16,nlps:14,switchFlag:0},{qe:0x5101,nmps:17,nlps:15,switchFlag:0},{qe:0x4801,nmps:18,nlps:16,switchFlag:0},{qe:0x3801,nmps:19,nlps:17,switchFlag:0},{qe:0x3401,nmps:20,nlps:18,switchFlag:0},{qe:0x3001,nmps:21,nlps:19,switchFlag:0},{qe:0x2801,nmps:22,nlps:19,switchFlag:0},{qe:0x2401,nmps:23,nlps:20,switchFlag:0},{qe:0x2201,nmps:24,nlps:21,switchFlag:0},{qe:0x1C01,nmps:25,nlps:22,switchFlag:0},{qe:0x1801,nmps:26,nlps:23,switchFlag:0},{qe:0x1601,nmps:27,nlps:24,switchFlag:0},{qe:0x1401,nmps:28,nlps:25,switchFlag:0},{qe:0x1201,nmps:29,nlps:26,switchFlag:0},{qe:0x1101,nmps:30,nlps:27,switchFlag:0},{qe:0x0AC1,nmps:31,nlps:28,switchFlag:0},{qe:0x09C1,nmps:32,nlps:29,switchFlag:0},{qe:0x08A1,nmps:33,nlps:30,switchFlag:0},{qe:0x0521,nmps:34,nlps:31,switchFlag:0},{qe:0x0441,nmps:35,nlps:32,switchFlag:0},{qe:0x02A1,nmps:36,nlps:33,switchFlag:0},{qe:0x0221,nmps:37,nlps:34,switchFlag:0},{qe:0x0141,nmps:38,nlps:35,switchFlag:0},{qe:0x0111,nmps:39,nlps:36,switchFlag:0},{qe:0x0085,nmps:40,nlps:37,switchFlag:0},{qe:0x0049,nmps:41,nlps:38,switchFlag:0},{qe:0x0025,nmps:42,nlps:39,switchFlag:0},{qe:0x0015,nmps:43,nlps:40,switchFlag:0},{qe:0x0009,nmps:44,nlps:41,switchFlag:0},{qe:0x0005,nmps:45,nlps:42,switchFlag:0},{qe:0x0001,nmps:45,nlps:43,switchFlag:0},{qe:0x5601,nmps:46,nlps:46,switchFlag:0}]; // C.3.5 Initialisation of the decoder (INITDEC)
function ArithmeticDecoder(data,start,end){this.data=data;this.bp=start;this.dataEnd=end;this.chigh=data[start];this.clow=0;this.byteIn();this.chigh=this.chigh<<7&0xFFFF|this.clow>>9&0x7F;this.clow=this.clow<<7&0xFFFF;this.ct-=7;this.a=0x8000;}ArithmeticDecoder.prototype={ // C.3.4 Compressed data input (BYTEIN)
byteIn:function ArithmeticDecoder_byteIn(){var data=this.data;var bp=this.bp;if(data[bp]===0xFF){var b1=data[bp+1];if(b1>0x8F){this.clow+=0xFF00;this.ct=8;}else {bp++;this.clow+=data[bp]<<9;this.ct=7;this.bp=bp;}}else {bp++;this.clow+=bp<this.dataEnd?data[bp]<<8:0xFF00;this.ct=8;this.bp=bp;}if(this.clow>0xFFFF){this.chigh+=this.clow>>16;this.clow&=0xFFFF;}}, // C.3.2 Decoding a decision (DECODE)
readBit:function ArithmeticDecoder_readBit(contexts,pos){ // contexts are packed into 1 byte:
// highest 7 bits carry cx.index, lowest bit carries cx.mps
var cx_index=contexts[pos]>>1,cx_mps=contexts[pos]&1;var qeTableIcx=QeTable[cx_index];var qeIcx=qeTableIcx.qe;var d;var a=this.a-qeIcx;if(this.chigh<qeIcx){ // exchangeLps
if(a<qeIcx){a=qeIcx;d=cx_mps;cx_index=qeTableIcx.nmps;}else {a=qeIcx;d=1^cx_mps;if(qeTableIcx.switchFlag===1){cx_mps=d;}cx_index=qeTableIcx.nlps;}}else {this.chigh-=qeIcx;if((a&0x8000)!==0){this.a=a;return cx_mps;} // exchangeMps
if(a<qeIcx){d=1^cx_mps;if(qeTableIcx.switchFlag===1){cx_mps=d;}cx_index=qeTableIcx.nlps;}else {d=cx_mps;cx_index=qeTableIcx.nmps;}} // C.3.3 renormD;
do {if(this.ct===0){this.byteIn();}a<<=1;this.chigh=this.chigh<<1&0xFFFF|this.clow>>15&1;this.clow=this.clow<<1&0xFFFF;this.ct--;}while((a&0x8000)===0);this.a=a;contexts[pos]=cx_index<<1|cx_mps;return d;}};return ArithmeticDecoder;}(); /* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */ /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */ /* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /* globals Cmd, ColorSpace, Dict, MozBlobBuilder, Name, PDFJS, Ref, URL,
           Promise */'use strict';var globalScope=typeof window==='undefined'?undefined:window;var isWorker=typeof window==='undefined';var FONT_IDENTITY_MATRIX=[0.001,0,0,0.001,0,0];var TextRenderingMode={FILL:0,STROKE:1,FILL_STROKE:2,INVISIBLE:3,FILL_ADD_TO_PATH:4,STROKE_ADD_TO_PATH:5,FILL_STROKE_ADD_TO_PATH:6,ADD_TO_PATH:7,FILL_STROKE_MASK:3,ADD_TO_PATH_FLAG:4};var ImageKind={GRAYSCALE_1BPP:1,RGB_24BPP:2,RGBA_32BPP:3};var AnnotationType={WIDGET:1,TEXT:2,LINK:3};var StreamType={UNKNOWN:0,FLATE:1,LZW:2,DCT:3,JPX:4,JBIG:5,A85:6,AHX:7,CCF:8,RL:9};var FontType={UNKNOWN:0,TYPE1:1,TYPE1C:2,CIDFONTTYPE0:3,CIDFONTTYPE0C:4,TRUETYPE:5,CIDFONTTYPE2:6,TYPE3:7,OPENTYPE:8,TYPE0:9,MMTYPE1:10}; // The global PDFJS object exposes the API
// In production, it will be declared outside a global wrapper
// In development, it will be declared here
if(!globalScope.PDFJS){globalScope.PDFJS={};}globalScope.PDFJS.pdfBug=false;PDFJS.VERBOSITY_LEVELS={errors:0,warnings:1,infos:5}; // All the possible operations for an operator list.
var OPS=PDFJS.OPS={ // Intentionally start from 1 so it is easy to spot bad operators that will be
// 0's.
dependency:1,setLineWidth:2,setLineCap:3,setLineJoin:4,setMiterLimit:5,setDash:6,setRenderingIntent:7,setFlatness:8,setGState:9,save:10,restore:11,transform:12,moveTo:13,lineTo:14,curveTo:15,curveTo2:16,curveTo3:17,closePath:18,rectangle:19,stroke:20,closeStroke:21,fill:22,eoFill:23,fillStroke:24,eoFillStroke:25,closeFillStroke:26,closeEOFillStroke:27,endPath:28,clip:29,eoClip:30,beginText:31,endText:32,setCharSpacing:33,setWordSpacing:34,setHScale:35,setLeading:36,setFont:37,setTextRenderingMode:38,setTextRise:39,moveText:40,setLeadingMoveText:41,setTextMatrix:42,nextLine:43,showText:44,showSpacedText:45,nextLineShowText:46,nextLineSetSpacingShowText:47,setCharWidth:48,setCharWidthAndBounds:49,setStrokeColorSpace:50,setFillColorSpace:51,setStrokeColor:52,setStrokeColorN:53,setFillColor:54,setFillColorN:55,setStrokeGray:56,setFillGray:57,setStrokeRGBColor:58,setFillRGBColor:59,setStrokeCMYKColor:60,setFillCMYKColor:61,shadingFill:62,beginInlineImage:63,beginImageData:64,endInlineImage:65,paintXObject:66,markPoint:67,markPointProps:68,beginMarkedContent:69,beginMarkedContentProps:70,endMarkedContent:71,beginCompat:72,endCompat:73,paintFormXObjectBegin:74,paintFormXObjectEnd:75,beginGroup:76,endGroup:77,beginAnnotations:78,endAnnotations:79,beginAnnotation:80,endAnnotation:81,paintJpegXObject:82,paintImageMaskXObject:83,paintImageMaskXObjectGroup:84,paintImageXObject:85,paintInlineImageXObject:86,paintInlineImageXObjectGroup:87,paintImageXObjectRepeat:88,paintImageMaskXObjectRepeat:89,paintSolidColorImageMask:90,constructPath:91}; // A notice for devs. These are good for things that are helpful to devs, such
// as warning that Workers were disabled, which is important to devs but not
// end users.
function info(msg){if(PDFJS.verbosity>=PDFJS.VERBOSITY_LEVELS.infos){console.log('Info: '+msg);}} // Non-fatal warnings.
function warn(msg){if(PDFJS.verbosity>=PDFJS.VERBOSITY_LEVELS.warnings){console.log('Warning: '+msg);}} // Fatal errors that should trigger the fallback UI and halt execution by
// throwing an exception.
function error(msg){ // If multiple arguments were passed, pass them all to the log function.
if(arguments.length>1){var logArguments=['Error:'];logArguments.push.apply(logArguments,arguments);console.log.apply(console,logArguments); // Join the arguments into a single string for the lines below.
msg=[].join.call(arguments,' ');}else {console.log('Error: '+msg);}console.log(backtrace());UnsupportedManager.notify(UNSUPPORTED_FEATURES.unknown);throw new Error(msg);}function backtrace(){try{throw new Error();}catch(e){return e.stack?e.stack.split('\n').slice(2).join('\n'):'';}}function assert(cond,msg){if(!cond){error(msg);}}var UNSUPPORTED_FEATURES=PDFJS.UNSUPPORTED_FEATURES={unknown:'unknown',forms:'forms',javaScript:'javaScript',smask:'smask',shadingPattern:'shadingPattern',font:'font'};var UnsupportedManager=PDFJS.UnsupportedManager=function UnsupportedManagerClosure(){var listeners=[];return {listen:function listen(cb){listeners.push(cb);},notify:function notify(featureId){warn('Unsupported feature "'+featureId+'"');for(var i=0,ii=listeners.length;i<ii;i++){listeners[i](featureId);}}};}(); // Combines two URLs. The baseUrl shall be absolute URL. If the url is an
// absolute URL, it will be returned as is.
function combineUrl(baseUrl,url){if(!url){return baseUrl;}if(/^[a-z][a-z0-9+\-.]*:/i.test(url)){return url;}var i;if(url.charAt(0)==='/'){ // absolute path
i=baseUrl.indexOf('://');if(url.charAt(1)==='/'){++i;}else {i=baseUrl.indexOf('/',i+3);}return baseUrl.substring(0,i)+url;}else { // relative path
var pathLength=baseUrl.length;i=baseUrl.lastIndexOf('#');pathLength=i>=0?i:pathLength;i=baseUrl.lastIndexOf('?',pathLength);pathLength=i>=0?i:pathLength;var prefixLength=baseUrl.lastIndexOf('/',pathLength);return baseUrl.substring(0,prefixLength+1)+url;}} // Validates if URL is safe and allowed, e.g. to avoid XSS.
function isValidUrl(url,allowRelative){if(!url){return false;} // RFC 3986 (http://tools.ietf.org/html/rfc3986#section-3.1)
// scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
var protocol=/^[a-z][a-z0-9+\-.]*(?=:)/i.exec(url);if(!protocol){return allowRelative;}protocol=protocol[0].toLowerCase();switch(protocol){case 'http':case 'https':case 'ftp':case 'mailto':case 'tel':return true;default:return false;}}PDFJS.isValidUrl=isValidUrl;function shadow(obj,prop,value){Object.defineProperty(obj,prop,{value:value,enumerable:true,configurable:true,writable:false});return value;}PDFJS.shadow=shadow;var PasswordResponses=PDFJS.PasswordResponses={NEED_PASSWORD:1,INCORRECT_PASSWORD:2};var PasswordException=function PasswordExceptionClosure(){function PasswordException(msg,code){this.name='PasswordException';this.message=msg;this.code=code;}PasswordException.prototype=new Error();PasswordException.constructor=PasswordException;return PasswordException;}();PDFJS.PasswordException=PasswordException;var UnknownErrorException=function UnknownErrorExceptionClosure(){function UnknownErrorException(msg,details){this.name='UnknownErrorException';this.message=msg;this.details=details;}UnknownErrorException.prototype=new Error();UnknownErrorException.constructor=UnknownErrorException;return UnknownErrorException;}();PDFJS.UnknownErrorException=UnknownErrorException;var InvalidPDFException=function InvalidPDFExceptionClosure(){function InvalidPDFException(msg){this.name='InvalidPDFException';this.message=msg;}InvalidPDFException.prototype=new Error();InvalidPDFException.constructor=InvalidPDFException;return InvalidPDFException;}();PDFJS.InvalidPDFException=InvalidPDFException;var MissingPDFException=function MissingPDFExceptionClosure(){function MissingPDFException(msg){this.name='MissingPDFException';this.message=msg;}MissingPDFException.prototype=new Error();MissingPDFException.constructor=MissingPDFException;return MissingPDFException;}();PDFJS.MissingPDFException=MissingPDFException;var UnexpectedResponseException=function UnexpectedResponseExceptionClosure(){function UnexpectedResponseException(msg,status){this.name='UnexpectedResponseException';this.message=msg;this.status=status;}UnexpectedResponseException.prototype=new Error();UnexpectedResponseException.constructor=UnexpectedResponseException;return UnexpectedResponseException;}();PDFJS.UnexpectedResponseException=UnexpectedResponseException;var NotImplementedException=function NotImplementedExceptionClosure(){function NotImplementedException(msg){this.message=msg;}NotImplementedException.prototype=new Error();NotImplementedException.prototype.name='NotImplementedException';NotImplementedException.constructor=NotImplementedException;return NotImplementedException;}();var MissingDataException=function MissingDataExceptionClosure(){function MissingDataException(begin,end){this.begin=begin;this.end=end;this.message='Missing data ['+begin+', '+end+')';}MissingDataException.prototype=new Error();MissingDataException.prototype.name='MissingDataException';MissingDataException.constructor=MissingDataException;return MissingDataException;}();var XRefParseException=function XRefParseExceptionClosure(){function XRefParseException(msg){this.message=msg;}XRefParseException.prototype=new Error();XRefParseException.prototype.name='XRefParseException';XRefParseException.constructor=XRefParseException;return XRefParseException;}();function bytesToString(bytes){assert(bytes!==null&&(typeof bytes==='undefined'?'undefined':_typeof(bytes))==='object'&&bytes.length!==undefined,'Invalid argument for bytesToString');var length=bytes.length;var MAX_ARGUMENT_COUNT=8192;if(length<MAX_ARGUMENT_COUNT){return String.fromCharCode.apply(null,bytes);}var strBuf=[];for(var i=0;i<length;i+=MAX_ARGUMENT_COUNT){var chunkEnd=Math.min(i+MAX_ARGUMENT_COUNT,length);var chunk=bytes.subarray(i,chunkEnd);strBuf.push(String.fromCharCode.apply(null,chunk));}return strBuf.join('');}function stringToBytes(str){assert(typeof str==='string','Invalid argument for stringToBytes');var length=str.length;var bytes=new Uint8Array(length);for(var i=0;i<length;++i){bytes[i]=str.charCodeAt(i)&0xFF;}return bytes;}function string32(value){return String.fromCharCode(value>>24&0xff,value>>16&0xff,value>>8&0xff,value&0xff);}function log2(x){var n=1,i=0;while(x>n){n<<=1;i++;}return i;}function readInt8(data,start){return data[start]<<24>>24;}function readUint16(data,offset){return data[offset]<<8|data[offset+1];}function readUint32(data,offset){return (data[offset]<<24|data[offset+1]<<16|data[offset+2]<<8|data[offset+3])>>>0;} // Lazy test the endianness of the platform
// NOTE: This will be 'true' for simulated TypedArrays
function isLittleEndian(){var buffer8=new Uint8Array(2);buffer8[0]=1;var buffer16=new Uint16Array(buffer8.buffer);return buffer16[0]===1;}Object.defineProperty(PDFJS,'isLittleEndian',{configurable:true,get:function PDFJS_isLittleEndian(){return shadow(PDFJS,'isLittleEndian',isLittleEndian());}}); //#if !(FIREFOX || MOZCENTRAL || B2G || CHROME)
//// Lazy test if the userAgant support CanvasTypedArrays
function hasCanvasTypedArrays(){var canvas=document.createElement('canvas');canvas.width=canvas.height=1;var ctx=canvas.getContext('2d');var imageData=ctx.createImageData(1,1);return typeof imageData.data.buffer!=='undefined';}Object.defineProperty(PDFJS,'hasCanvasTypedArrays',{configurable:true,get:function PDFJS_hasCanvasTypedArrays(){return shadow(PDFJS,'hasCanvasTypedArrays',hasCanvasTypedArrays());}});var Uint32ArrayView=function Uint32ArrayViewClosure(){function Uint32ArrayView(buffer,length){this.buffer=buffer;this.byteLength=buffer.length;this.length=length===undefined?this.byteLength>>2:length;ensureUint32ArrayViewProps(this.length);}Uint32ArrayView.prototype=Object.create(null);var uint32ArrayViewSetters=0;function createUint32ArrayProp(index){return {get:function get(){var buffer=this.buffer,offset=index<<2;return (buffer[offset]|buffer[offset+1]<<8|buffer[offset+2]<<16|buffer[offset+3]<<24)>>>0;},set:function set(value){var buffer=this.buffer,offset=index<<2;buffer[offset]=value&255;buffer[offset+1]=value>>8&255;buffer[offset+2]=value>>16&255;buffer[offset+3]=value>>>24&255;}};}function ensureUint32ArrayViewProps(length){while(uint32ArrayViewSetters<length){Object.defineProperty(Uint32ArrayView.prototype,uint32ArrayViewSetters,createUint32ArrayProp(uint32ArrayViewSetters));uint32ArrayViewSetters++;}}return Uint32ArrayView;}(); //#else
//PDFJS.hasCanvasTypedArrays = true;
//#endif
var IDENTITY_MATRIX=[1,0,0,1,0,0];var Util=PDFJS.Util=function UtilClosure(){function Util(){}var rgbBuf=['rgb(',0,',',0,',',0,')']; // makeCssRgb() can be called thousands of times. Using |rgbBuf| avoids
// creating many intermediate strings.
Util.makeCssRgb=function Util_makeCssRgb(r,g,b){rgbBuf[1]=r;rgbBuf[3]=g;rgbBuf[5]=b;return rgbBuf.join('');}; // Concatenates two transformation matrices together and returns the result.
Util.transform=function Util_transform(m1,m2){return [m1[0]*m2[0]+m1[2]*m2[1],m1[1]*m2[0]+m1[3]*m2[1],m1[0]*m2[2]+m1[2]*m2[3],m1[1]*m2[2]+m1[3]*m2[3],m1[0]*m2[4]+m1[2]*m2[5]+m1[4],m1[1]*m2[4]+m1[3]*m2[5]+m1[5]];}; // For 2d affine transforms
Util.applyTransform=function Util_applyTransform(p,m){var xt=p[0]*m[0]+p[1]*m[2]+m[4];var yt=p[0]*m[1]+p[1]*m[3]+m[5];return [xt,yt];};Util.applyInverseTransform=function Util_applyInverseTransform(p,m){var d=m[0]*m[3]-m[1]*m[2];var xt=(p[0]*m[3]-p[1]*m[2]+m[2]*m[5]-m[4]*m[3])/d;var yt=(-p[0]*m[1]+p[1]*m[0]+m[4]*m[1]-m[5]*m[0])/d;return [xt,yt];}; // Applies the transform to the rectangle and finds the minimum axially
// aligned bounding box.
Util.getAxialAlignedBoundingBox=function Util_getAxialAlignedBoundingBox(r,m){var p1=Util.applyTransform(r,m);var p2=Util.applyTransform(r.slice(2,4),m);var p3=Util.applyTransform([r[0],r[3]],m);var p4=Util.applyTransform([r[2],r[1]],m);return [Math.min(p1[0],p2[0],p3[0],p4[0]),Math.min(p1[1],p2[1],p3[1],p4[1]),Math.max(p1[0],p2[0],p3[0],p4[0]),Math.max(p1[1],p2[1],p3[1],p4[1])];};Util.inverseTransform=function Util_inverseTransform(m){var d=m[0]*m[3]-m[1]*m[2];return [m[3]/d,-m[1]/d,-m[2]/d,m[0]/d,(m[2]*m[5]-m[4]*m[3])/d,(m[4]*m[1]-m[5]*m[0])/d];}; // Apply a generic 3d matrix M on a 3-vector v:
//   | a b c |   | X |
//   | d e f | x | Y |
//   | g h i |   | Z |
// M is assumed to be serialized as [a,b,c,d,e,f,g,h,i],
// with v as [X,Y,Z]
Util.apply3dTransform=function Util_apply3dTransform(m,v){return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2],m[3]*v[0]+m[4]*v[1]+m[5]*v[2],m[6]*v[0]+m[7]*v[1]+m[8]*v[2]];}; // This calculation uses Singular Value Decomposition.
// The SVD can be represented with formula A = USV. We are interested in the
// matrix S here because it represents the scale values.
Util.singularValueDecompose2dScale=function Util_singularValueDecompose2dScale(m){var transpose=[m[0],m[2],m[1],m[3]]; // Multiply matrix m with its transpose.
var a=m[0]*transpose[0]+m[1]*transpose[2];var b=m[0]*transpose[1]+m[1]*transpose[3];var c=m[2]*transpose[0]+m[3]*transpose[2];var d=m[2]*transpose[1]+m[3]*transpose[3]; // Solve the second degree polynomial to get roots.
var first=(a+d)/2;var second=Math.sqrt((a+d)*(a+d)-4*(a*d-c*b))/2;var sx=first+second||1;var sy=first-second||1; // Scale values are the square roots of the eigenvalues.
return [Math.sqrt(sx),Math.sqrt(sy)];}; // Normalize rectangle rect=[x1, y1, x2, y2] so that (x1,y1) < (x2,y2)
// For coordinate systems whose origin lies in the bottom-left, this
// means normalization to (BL,TR) ordering. For systems with origin in the
// top-left, this means (TL,BR) ordering.
Util.normalizeRect=function Util_normalizeRect(rect){var r=rect.slice(0); // clone rect
if(rect[0]>rect[2]){r[0]=rect[2];r[2]=rect[0];}if(rect[1]>rect[3]){r[1]=rect[3];r[3]=rect[1];}return r;}; // Returns a rectangle [x1, y1, x2, y2] corresponding to the
// intersection of rect1 and rect2. If no intersection, returns 'false'
// The rectangle coordinates of rect1, rect2 should be [x1, y1, x2, y2]
Util.intersect=function Util_intersect(rect1,rect2){function compare(a,b){return a-b;} // Order points along the axes
var orderedX=[rect1[0],rect1[2],rect2[0],rect2[2]].sort(compare),orderedY=[rect1[1],rect1[3],rect2[1],rect2[3]].sort(compare),result=[];rect1=Util.normalizeRect(rect1);rect2=Util.normalizeRect(rect2); // X: first and second points belong to different rectangles?
if(orderedX[0]===rect1[0]&&orderedX[1]===rect2[0]||orderedX[0]===rect2[0]&&orderedX[1]===rect1[0]){ // Intersection must be between second and third points
result[0]=orderedX[1];result[2]=orderedX[2];}else {return false;} // Y: first and second points belong to different rectangles?
if(orderedY[0]===rect1[1]&&orderedY[1]===rect2[1]||orderedY[0]===rect2[1]&&orderedY[1]===rect1[1]){ // Intersection must be between second and third points
result[1]=orderedY[1];result[3]=orderedY[2];}else {return false;}return result;};Util.sign=function Util_sign(num){return num<0?-1:1;};Util.appendToArray=function Util_appendToArray(arr1,arr2){Array.prototype.push.apply(arr1,arr2);};Util.prependToArray=function Util_prependToArray(arr1,arr2){Array.prototype.unshift.apply(arr1,arr2);};Util.extendObj=function extendObj(obj1,obj2){for(var key in obj2){obj1[key]=obj2[key];}};Util.getInheritableProperty=function Util_getInheritableProperty(dict,name){while(dict&&!dict.has(name)){dict=dict.get('Parent');}if(!dict){return null;}return dict.get(name);};Util.inherit=function Util_inherit(sub,base,prototype){sub.prototype=Object.create(base.prototype);sub.prototype.constructor=sub;for(var prop in prototype){sub.prototype[prop]=prototype[prop];}};Util.loadScript=function Util_loadScript(src,callback){var script=document.createElement('script');var loaded=false;script.setAttribute('src',src);if(callback){script.onload=function(){if(!loaded){callback();}loaded=true;};}document.getElementsByTagName('head')[0].appendChild(script);};return Util;}(); /**
 * PDF page viewport created based on scale, rotation and offset.
 * @class
 * @alias PDFJS.PageViewport
 */var PageViewport=PDFJS.PageViewport=function PageViewportClosure(){ /**
   * @constructor
   * @private
   * @param viewBox {Array} xMin, yMin, xMax and yMax coordinates.
   * @param scale {number} scale of the viewport.
   * @param rotation {number} rotations of the viewport in degrees.
   * @param offsetX {number} offset X
   * @param offsetY {number} offset Y
   * @param dontFlip {boolean} if true, axis Y will not be flipped.
   */function PageViewport(viewBox,scale,rotation,offsetX,offsetY,dontFlip){this.viewBox=viewBox;this.scale=scale;this.rotation=rotation;this.offsetX=offsetX;this.offsetY=offsetY; // creating transform to convert pdf coordinate system to the normal
// canvas like coordinates taking in account scale and rotation
var centerX=(viewBox[2]+viewBox[0])/2;var centerY=(viewBox[3]+viewBox[1])/2;var rotateA,rotateB,rotateC,rotateD;rotation=rotation%360;rotation=rotation<0?rotation+360:rotation;switch(rotation){case 180:rotateA=-1;rotateB=0;rotateC=0;rotateD=1;break;case 90:rotateA=0;rotateB=1;rotateC=1;rotateD=0;break;case 270:rotateA=0;rotateB=-1;rotateC=-1;rotateD=0;break; //case 0:
default:rotateA=1;rotateB=0;rotateC=0;rotateD=-1;break;}if(dontFlip){rotateC=-rotateC;rotateD=-rotateD;}var offsetCanvasX,offsetCanvasY;var width,height;if(rotateA===0){offsetCanvasX=Math.abs(centerY-viewBox[1])*scale+offsetX;offsetCanvasY=Math.abs(centerX-viewBox[0])*scale+offsetY;width=Math.abs(viewBox[3]-viewBox[1])*scale;height=Math.abs(viewBox[2]-viewBox[0])*scale;}else {offsetCanvasX=Math.abs(centerX-viewBox[0])*scale+offsetX;offsetCanvasY=Math.abs(centerY-viewBox[1])*scale+offsetY;width=Math.abs(viewBox[2]-viewBox[0])*scale;height=Math.abs(viewBox[3]-viewBox[1])*scale;} // creating transform for the following operations:
// translate(-centerX, -centerY), rotate and flip vertically,
// scale, and translate(offsetCanvasX, offsetCanvasY)
this.transform=[rotateA*scale,rotateB*scale,rotateC*scale,rotateD*scale,offsetCanvasX-rotateA*scale*centerX-rotateC*scale*centerY,offsetCanvasY-rotateB*scale*centerX-rotateD*scale*centerY];this.width=width;this.height=height;this.fontScale=scale;}PageViewport.prototype= /** @lends PDFJS.PageViewport.prototype */{ /**
     * Clones viewport with additional properties.
     * @param args {Object} (optional) If specified, may contain the 'scale' or
     * 'rotation' properties to override the corresponding properties in
     * the cloned viewport.
     * @returns {PDFJS.PageViewport} Cloned viewport.
     */clone:function PageViewPort_clone(args){args=args||{};var scale='scale' in args?args.scale:this.scale;var rotation='rotation' in args?args.rotation:this.rotation;return new PageViewport(this.viewBox.slice(),scale,rotation,this.offsetX,this.offsetY,args.dontFlip);}, /**
     * Converts PDF point to the viewport coordinates. For examples, useful for
     * converting PDF location into canvas pixel coordinates.
     * @param x {number} X coordinate.
     * @param y {number} Y coordinate.
     * @returns {Object} Object that contains 'x' and 'y' properties of the
     * point in the viewport coordinate space.
     * @see {@link convertToPdfPoint}
     * @see {@link convertToViewportRectangle}
     */convertToViewportPoint:function PageViewport_convertToViewportPoint(x,y){return Util.applyTransform([x,y],this.transform);}, /**
     * Converts PDF rectangle to the viewport coordinates.
     * @param rect {Array} xMin, yMin, xMax and yMax coordinates.
     * @returns {Array} Contains corresponding coordinates of the rectangle
     * in the viewport coordinate space.
     * @see {@link convertToViewportPoint}
     */convertToViewportRectangle:function PageViewport_convertToViewportRectangle(rect){var tl=Util.applyTransform([rect[0],rect[1]],this.transform);var br=Util.applyTransform([rect[2],rect[3]],this.transform);return [tl[0],tl[1],br[0],br[1]];}, /**
     * Converts viewport coordinates to the PDF location. For examples, useful
     * for converting canvas pixel location into PDF one.
     * @param x {number} X coordinate.
     * @param y {number} Y coordinate.
     * @returns {Object} Object that contains 'x' and 'y' properties of the
     * point in the PDF coordinate space.
     * @see {@link convertToViewportPoint}
     */convertToPdfPoint:function PageViewport_convertToPdfPoint(x,y){return Util.applyInverseTransform([x,y],this.transform);}};return PageViewport;}();var PDFStringTranslateTable=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0x2D8,0x2C7,0x2C6,0x2D9,0x2DD,0x2DB,0x2DA,0x2DC,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0x2022,0x2020,0x2021,0x2026,0x2014,0x2013,0x192,0x2044,0x2039,0x203A,0x2212,0x2030,0x201E,0x201C,0x201D,0x2018,0x2019,0x201A,0x2122,0xFB01,0xFB02,0x141,0x152,0x160,0x178,0x17D,0x131,0x142,0x153,0x161,0x17E,0,0x20AC];function stringToPDFString(str){var i,n=str.length,strBuf=[];if(str[0]==='\xFE'&&str[1]==='\xFF'){ // UTF16BE BOM
for(i=2;i<n;i+=2){strBuf.push(String.fromCharCode(str.charCodeAt(i)<<8|str.charCodeAt(i+1)));}}else {for(i=0;i<n;++i){var code=PDFStringTranslateTable[str.charCodeAt(i)];strBuf.push(code?String.fromCharCode(code):str.charAt(i));}}return strBuf.join('');}function stringToUTF8String(str){return decodeURIComponent(escape(str));}function isEmptyObj(obj){for(var key in obj){return false;}return true;}function isBool(v){return typeof v==='boolean';}function isInt(v){return typeof v==='number'&&(v|0)===v;}function isNum(v){return typeof v==='number';}function isString(v){return typeof v==='string';}function isNull(v){return v===null;}function isName(v){return v instanceof Name;}function isCmd(v,cmd){return v instanceof Cmd&&(cmd===undefined||v.cmd===cmd);}function isDict(v,type){if(!(v instanceof Dict)){return false;}if(!type){return true;}var dictType=v.get('Type');return isName(dictType)&&dictType.name===type;}function isArray(v){return v instanceof Array;}function isStream(v){return (typeof v==='undefined'?'undefined':_typeof(v))==='object'&&v!==null&&v.getBytes!==undefined;}function isArrayBuffer(v){return (typeof v==='undefined'?'undefined':_typeof(v))==='object'&&v!==null&&v.byteLength!==undefined;}function isRef(v){return v instanceof Ref;} /**
 * Promise Capability object.
 *
 * @typedef {Object} PromiseCapability
 * @property {Promise} promise - A promise object.
 * @property {function} resolve - Fullfills the promise.
 * @property {function} reject - Rejects the promise.
 */ /**
 * Creates a promise capability object.
 * @alias PDFJS.createPromiseCapability
 *
 * @return {PromiseCapability} A capability object contains:
 * - a Promise, resolve and reject methods.
 */function createPromiseCapability(){var capability={};capability.promise=new Promise(function(resolve,reject){capability.resolve=resolve;capability.reject=reject;});return capability;}PDFJS.createPromiseCapability=createPromiseCapability; /**
 * Polyfill for Promises:
 * The following promise implementation tries to generally implement the
 * Promise/A+ spec. Some notable differences from other promise libaries are:
 * - There currently isn't a seperate deferred and promise object.
 * - Unhandled rejections eventually show an error if they aren't handled.
 *
 * Based off of the work in:
 * https://bugzilla.mozilla.org/show_bug.cgi?id=810490
 */(function PromiseClosure(){if(globalScope.Promise){ // Promises existing in the DOM/Worker, checking presence of all/resolve
if(typeof globalScope.Promise.all!=='function'){globalScope.Promise.all=function(iterable){var count=0,results=[],resolve,reject;var promise=new globalScope.Promise(function(resolve_,reject_){resolve=resolve_;reject=reject_;});iterable.forEach(function(p,i){count++;p.then(function(result){results[i]=result;count--;if(count===0){resolve(results);}},reject);});if(count===0){resolve(results);}return promise;};}if(typeof globalScope.Promise.resolve!=='function'){globalScope.Promise.resolve=function(value){return new globalScope.Promise(function(resolve){resolve(value);});};}if(typeof globalScope.Promise.reject!=='function'){globalScope.Promise.reject=function(reason){return new globalScope.Promise(function(resolve,reject){reject(reason);});};}if(typeof globalScope.Promise.prototype.catch!=='function'){globalScope.Promise.prototype.catch=function(onReject){return globalScope.Promise.prototype.then(undefined,onReject);};}return;} //#if !MOZCENTRAL
var STATUS_PENDING=0;var STATUS_RESOLVED=1;var STATUS_REJECTED=2; // In an attempt to avoid silent exceptions, unhandled rejections are
// tracked and if they aren't handled in a certain amount of time an
// error is logged.
var REJECTION_TIMEOUT=500;var HandlerManager={handlers:[],running:false,unhandledRejections:[],pendingRejectionCheck:false,scheduleHandlers:function scheduleHandlers(promise){if(promise._status===STATUS_PENDING){return;}this.handlers=this.handlers.concat(promise._handlers);promise._handlers=[];if(this.running){return;}this.running=true;setTimeout(this.runHandlers.bind(this),0);},runHandlers:function runHandlers(){var RUN_TIMEOUT=1; // ms
var timeoutAt=Date.now()+RUN_TIMEOUT;while(this.handlers.length>0){var handler=this.handlers.shift();var nextStatus=handler.thisPromise._status;var nextValue=handler.thisPromise._value;try{if(nextStatus===STATUS_RESOLVED){if(typeof handler.onResolve==='function'){nextValue=handler.onResolve(nextValue);}}else if(typeof handler.onReject==='function'){nextValue=handler.onReject(nextValue);nextStatus=STATUS_RESOLVED;if(handler.thisPromise._unhandledRejection){this.removeUnhandeledRejection(handler.thisPromise);}}}catch(ex){nextStatus=STATUS_REJECTED;nextValue=ex;}handler.nextPromise._updateStatus(nextStatus,nextValue);if(Date.now()>=timeoutAt){break;}}if(this.handlers.length>0){setTimeout(this.runHandlers.bind(this),0);return;}this.running=false;},addUnhandledRejection:function addUnhandledRejection(promise){this.unhandledRejections.push({promise:promise,time:Date.now()});this.scheduleRejectionCheck();},removeUnhandeledRejection:function removeUnhandeledRejection(promise){promise._unhandledRejection=false;for(var i=0;i<this.unhandledRejections.length;i++){if(this.unhandledRejections[i].promise===promise){this.unhandledRejections.splice(i);i--;}}},scheduleRejectionCheck:function scheduleRejectionCheck(){if(this.pendingRejectionCheck){return;}this.pendingRejectionCheck=true;setTimeout(function rejectionCheck(){this.pendingRejectionCheck=false;var now=Date.now();for(var i=0;i<this.unhandledRejections.length;i++){if(now-this.unhandledRejections[i].time>REJECTION_TIMEOUT){var unhandled=this.unhandledRejections[i].promise._value;var msg='Unhandled rejection: '+unhandled;if(unhandled.stack){msg+='\n'+unhandled.stack;}warn(msg);this.unhandledRejections.splice(i);i--;}}if(this.unhandledRejections.length){this.scheduleRejectionCheck();}}.bind(this),REJECTION_TIMEOUT);}};function Promise(resolver){this._status=STATUS_PENDING;this._handlers=[];try{resolver.call(this,this._resolve.bind(this),this._reject.bind(this));}catch(e){this._reject(e);}} /**
   * Builds a promise that is resolved when all the passed in promises are
   * resolved.
   * @param {array} array of data and/or promises to wait for.
   * @return {Promise} New dependant promise.
   */Promise.all=function Promise_all(promises){var resolveAll,rejectAll;var deferred=new Promise(function(resolve,reject){resolveAll=resolve;rejectAll=reject;});var unresolved=promises.length;var results=[];if(unresolved===0){resolveAll(results);return deferred;}function reject(reason){if(deferred._status===STATUS_REJECTED){return;}results=[];rejectAll(reason);}for(var i=0,ii=promises.length;i<ii;++i){var promise=promises[i];var resolve=function(i){return function(value){if(deferred._status===STATUS_REJECTED){return;}results[i]=value;unresolved--;if(unresolved===0){resolveAll(results);}};}(i);if(Promise.isPromise(promise)){promise.then(resolve,reject);}else {resolve(promise);}}return deferred;}; /**
   * Checks if the value is likely a promise (has a 'then' function).
   * @return {boolean} true if value is thenable
   */Promise.isPromise=function Promise_isPromise(value){return value&&typeof value.then==='function';}; /**
   * Creates resolved promise
   * @param value resolve value
   * @returns {Promise}
   */Promise.resolve=function Promise_resolve(value){return new Promise(function(resolve){resolve(value);});}; /**
   * Creates rejected promise
   * @param reason rejection value
   * @returns {Promise}
   */Promise.reject=function Promise_reject(reason){return new Promise(function(resolve,reject){reject(reason);});};Promise.prototype={_status:null,_value:null,_handlers:null,_unhandledRejection:null,_updateStatus:function Promise__updateStatus(status,value){if(this._status===STATUS_RESOLVED||this._status===STATUS_REJECTED){return;}if(status===STATUS_RESOLVED&&Promise.isPromise(value)){value.then(this._updateStatus.bind(this,STATUS_RESOLVED),this._updateStatus.bind(this,STATUS_REJECTED));return;}this._status=status;this._value=value;if(status===STATUS_REJECTED&&this._handlers.length===0){this._unhandledRejection=true;HandlerManager.addUnhandledRejection(this);}HandlerManager.scheduleHandlers(this);},_resolve:function Promise_resolve(value){this._updateStatus(STATUS_RESOLVED,value);},_reject:function Promise_reject(reason){this._updateStatus(STATUS_REJECTED,reason);},then:function Promise_then(onResolve,onReject){var nextPromise=new Promise(function(resolve,reject){this.resolve=resolve;this.reject=reject;});this._handlers.push({thisPromise:this,onResolve:onResolve,onReject:onReject,nextPromise:nextPromise});HandlerManager.scheduleHandlers(this);return nextPromise;},catch:function Promise_catch(onReject){return this.then(undefined,onReject);}};globalScope.Promise=Promise; //#else
//throw new Error('DOM Promise is not present');
//#endif
})();var StatTimer=function StatTimerClosure(){function rpad(str,pad,length){while(str.length<length){str+=pad;}return str;}function StatTimer(){this.started={};this.times=[];this.enabled=true;}StatTimer.prototype={time:function StatTimer_time(name){if(!this.enabled){return;}if(name in this.started){warn('Timer is already running for '+name);}this.started[name]=Date.now();},timeEnd:function StatTimer_timeEnd(name){if(!this.enabled){return;}if(!(name in this.started)){warn('Timer has not been started for '+name);}this.times.push({'name':name,'start':this.started[name],'end':Date.now()}); // Remove timer from started so it can be called again.
delete this.started[name];},toString:function StatTimer_toString(){var i,ii;var times=this.times;var out=''; // Find the longest name for padding purposes.
var longest=0;for(i=0,ii=times.length;i<ii;++i){var name=times[i]['name'];if(name.length>longest){longest=name.length;}}for(i=0,ii=times.length;i<ii;++i){var span=times[i];var duration=span.end-span.start;out+=rpad(span['name'],' ',longest)+' '+duration+'ms\n';}return out;}};return StatTimer;}();PDFJS.createBlob=function createBlob(data,contentType){if(typeof Blob!=='undefined'){return new Blob([data],{type:contentType});} // Blob builder is deprecated in FF14 and removed in FF18.
var bb=new MozBlobBuilder();bb.append(data);return bb.getBlob(contentType);};PDFJS.createObjectURL=function createObjectURLClosure(){ // Blob/createObjectURL is not available, falling back to data schema.
var digits='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';return function createObjectURL(data,contentType){if(!PDFJS.disableCreateObjectURL&&typeof URL!=='undefined'&&URL.createObjectURL){var blob=PDFJS.createBlob(data,contentType);return URL.createObjectURL(blob);}var buffer='data:'+contentType+';base64,';for(var i=0,ii=data.length;i<ii;i+=3){var b1=data[i]&0xFF;var b2=data[i+1]&0xFF;var b3=data[i+2]&0xFF;var d1=b1>>2,d2=(b1&3)<<4|b2>>4;var d3=i+1<ii?(b2&0xF)<<2|b3>>6:64;var d4=i+2<ii?b3&0x3F:64;buffer+=digits[d1]+digits[d2]+digits[d3]+digits[d4];}return buffer;};}();function MessageHandler(name,comObj){this.name=name;this.comObj=comObj;this.callbackIndex=1;this.postMessageTransfers=true;var callbacksCapabilities=this.callbacksCapabilities={};var ah=this.actionHandler={};ah['console_log']=[function ahConsoleLog(data){console.log.apply(console,data);}];ah['console_error']=[function ahConsoleError(data){console.error.apply(console,data);}];ah['_unsupported_feature']=[function ah_unsupportedFeature(data){UnsupportedManager.notify(data);}];comObj.onmessage=function messageHandlerComObjOnMessage(event){var data=event.data;if(data.isReply){var callbackId=data.callbackId;if(data.callbackId in callbacksCapabilities){var callback=callbacksCapabilities[callbackId];delete callbacksCapabilities[callbackId];if('error' in data){callback.reject(data.error);}else {callback.resolve(data.data);}}else {error('Cannot resolve callback '+callbackId);}}else if(data.action in ah){var action=ah[data.action];if(data.callbackId){Promise.resolve().then(function(){return action[0].call(action[1],data.data);}).then(function(result){comObj.postMessage({isReply:true,callbackId:data.callbackId,data:result});},function(reason){comObj.postMessage({isReply:true,callbackId:data.callbackId,error:reason});});}else {action[0].call(action[1],data.data);}}else {error('Unknown action from worker: '+data.action);}};}MessageHandler.prototype={on:function messageHandlerOn(actionName,handler,scope){var ah=this.actionHandler;if(ah[actionName]){error('There is already an actionName called "'+actionName+'"');}ah[actionName]=[handler,scope];}, /**
   * Sends a message to the comObj to invoke the action with the supplied data.
   * @param {String} actionName Action to call.
   * @param {JSON} data JSON data to send.
   * @param {Array} [transfers] Optional list of transfers/ArrayBuffers
   */send:function messageHandlerSend(actionName,data,transfers){var message={action:actionName,data:data};this.postMessage(message,transfers);}, /**
   * Sends a message to the comObj to invoke the action with the supplied data.
   * Expects that other side will callback with the response.
   * @param {String} actionName Action to call.
   * @param {JSON} data JSON data to send.
   * @param {Array} [transfers] Optional list of transfers/ArrayBuffers.
   * @returns {Promise} Promise to be resolved with response data.
   */sendWithPromise:function messageHandlerSendWithPromise(actionName,data,transfers){var callbackId=this.callbackIndex++;var message={action:actionName,data:data,callbackId:callbackId};var capability=createPromiseCapability();this.callbacksCapabilities[callbackId]=capability;try{this.postMessage(message,transfers);}catch(e){capability.reject(e);}return capability.promise;}, /**
   * Sends raw message to the comObj.
   * @private
   * @param message {Object} Raw message.
   * @param transfers List of transfers/ArrayBuffers, or undefined.
   */postMessage:function postMessage(message,transfers){if(transfers&&this.postMessageTransfers){this.comObj.postMessage(message,transfers);}else {this.comObj.postMessage(message);}}};var moduleType=typeof module==='undefined'?'undefined':_typeof(module);if(moduleType!=='undefined'&&module.exports){module.exports=JpxImage;}function loadJpegStream(id,imageUrl,objs){var img=new Image();img.onload=function loadJpegStream_onloadClosure(){objs.resolve(id,img);};img.onerror=function loadJpegStream_onerrorClosure(){objs.resolve(id,null);warn('Error during JPEG image loading');};img.src=imageUrl;}

},{}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//ftp://medical.nema.org/MEDICAL/Dicom/2014c/output/chtml/part05/sect_6.2.html/

// imports
var DicomParser = require('dicom-parser');
var JpegBaseline = require('./jpeg');
var Jpx = require('./jpx');
var Jpeg = require('jpeg-lossless-decoder-js');

/**
 * Dicom parser is a combination of utilities to get a VJS image from dicom files.
 *
 * Relies on dcmjs, jquery, HTML5 fetch API, HTML5 promise API.
 *
 * @constructor
 * @class
 * @memberOf VJS.parsers
 * @public
 *
 * @param arrayBuffer {arraybuffer} - List of files to be parsed. It is urls from which
 * VJS.parsers.dicom can pull the data from.
 */

var ParsersDicom = function () {
  function ParsersDicom(arrayBuffer, id) {
    _classCallCheck(this, ParsersDicom);

    /**
     * @member
     * @type {arraybuffer}
     */
    this._id = id;
    this._arrayBuffer = arrayBuffer;

    var byteArray = new Uint8Array(arrayBuffer);

    // catch error
    // throw error if any!
    this._dataSet = null;
    try {
      this._dataSet = DicomParser.parseDicom(byteArray);
    } catch (e) {
      window.console.log(e);
      throw 'parsers.dicom could not parse the dicom';
    }
  }

  // image/frame specific


  _createClass(ParsersDicom, [{
    key: 'seriesInstanceUID',
    value: function seriesInstanceUID() {
      return this._dataSet.string('x0020000e');
    }
  }, {
    key: 'studyInstanceUID',
    value: function studyInstanceUID() {
      return this._dataSet.string('x0020000d');
    }
  }, {
    key: 'modality',
    value: function modality() {
      return this._dataSet.string('x00080060');
    }
  }, {
    key: 'sopInstanceUID',
    value: function sopInstanceUID() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      // 2005140f only works for siemens
      // which is the real one?
      var sopInstanceUID = this._findStringEverywhere('x2005140f', 'x00080018', frameIndex);
      return sopInstanceUID;
    }
  }, {
    key: 'transferSyntaxUID',
    value: function transferSyntaxUID() {
      return this._dataSet.string('x00020010');
    }
  }, {
    key: 'photometricInterpretation',
    value: function photometricInterpretation() {
      return this._dataSet.string('x00280004');
    }
  }, {
    key: 'planarConfiguration',
    value: function planarConfiguration() {
      var planarConfiguration = this._dataSet.uint16('x00280006');

      if (typeof planarConfiguration === 'undefined') {
        planarConfiguration = null;
      }

      return planarConfiguration;
    }
  }, {
    key: 'samplesPerPixel',
    value: function samplesPerPixel() {
      return this._dataSet.uint16('x00280002');
    }
  }, {
    key: 'numberOfFrames',
    value: function numberOfFrames() {
      var numberOfFrames = this._dataSet.intString('x00280008');

      // need something smarter!
      if (typeof numberOfFrames === 'undefined') {
        numberOfFrames = null;
      }

      // make sure we return a number! (not a string!)
      return numberOfFrames;
    }
  }, {
    key: 'numberOfChannels',
    value: function numberOfChannels() {
      var numberOfChannels = 1;
      var photometricInterpretation = this.photometricInterpretation();

      if (photometricInterpretation === 'RGB' || photometricInterpretation === 'PALETTE COLOR' || photometricInterpretation === 'YBR_FULL' || photometricInterpretation === 'YBR_FULL_422' || photometricInterpretation === 'YBR_PARTIAL_422' || photometricInterpretation === 'YBR_PARTIAL_420' || photometricInterpretation === 'YBR_RCT') {
        numberOfChannels = 3;
      }

      // make sure we return a number! (not a string!)
      return numberOfChannels;
    }
  }, {
    key: 'imageOrientation',
    value: function imageOrientation() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      // expect frame index to start at 0!
      var imageOrientation = this._findStringEverywhere('x00209116', 'x00200037', frameIndex);

      // format image orientation ('1\0\0\0\1\0') to array containing 6 numbers
      if (imageOrientation) {
        // make sure we return a number! (not a string!)
        // might not need to split (floatString + index)
        imageOrientation = imageOrientation.split('\\').map(Number);
      }

      return imageOrientation;
    }
  }, {
    key: 'pixelAspectRatio',
    value: function pixelAspectRatio() {
      var pixelAspectRatio = [this._dataSet.intString('x00280034', 0), this._dataSet.intString('x00280034', 1)];

      // need something smarter!
      if (typeof pixelAspectRatio[0] === 'undefined') {
        pixelAspectRatio = null;
      }

      // make sure we return a number! (not a string!)
      return pixelAspectRatio;
    }
  }, {
    key: 'imagePosition',
    value: function imagePosition() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var imagePosition = this._findStringEverywhere('x00209113', 'x00200032', frameIndex);

      // format image orientation ('1\0\0\0\1\0') to array containing 6 numbers
      if (imagePosition) {
        // make sure we return a number! (not a string!)
        imagePosition = imagePosition.split('\\').map(Number);
      }

      return imagePosition;
    }
  }, {
    key: 'instanceNumber',
    value: function instanceNumber() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var instanceNumber = null;
      // first look for frame!
      // per frame functionnal group sequence
      var perFrameFunctionnalGroupSequence = this._dataSet.elements.x52009230;

      if (typeof perFrameFunctionnalGroupSequence !== 'undefined') {
        if (perFrameFunctionnalGroupSequence.items[frameIndex].dataSet.elements.x2005140f) {
          var planeOrientationSequence = perFrameFunctionnalGroupSequence.items[frameIndex].dataSet.elements.x2005140f.items[0].dataSet;
          instanceNumber = planeOrientationSequence.intString('x00200013');
        } else {
          instanceNumber = this._dataSet.intString('x00200013');

          if (typeof instanceNumber === 'undefined') {
            instanceNumber = null;
          }
        }
      } else {
        // should we default to undefined??
        // default orientation
        instanceNumber = this._dataSet.intString('x00200013');

        if (typeof instanceNumber === 'undefined') {
          instanceNumber = null;
        }
      }

      return instanceNumber;
    }
  }, {
    key: 'pixelSpacing',
    value: function pixelSpacing() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      // expect frame index to start at 0!
      var pixelSpacing = this._findStringEverywhere('x00289110', 'x00280030', frameIndex);

      // format image orientation ('1\0\0\0\1\0') to array containing 6 numbers
      // should we default to undefined??
      if (pixelSpacing) {
        // make sure we return array of numbers! (not strings!)
        pixelSpacing = pixelSpacing.split('\\').map(Number);
      }
      return pixelSpacing;
    }
  }, {
    key: 'rows',
    value: function rows() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var rows = this._dataSet.uint16('x00280010');

      if (typeof rows === 'undefined') {
        rows = null;
        // print warning at least...
      }

      return rows;
    }
  }, {
    key: 'columns',
    value: function columns() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var columns = this._dataSet.uint16('x00280011');

      if (typeof columns === 'undefined') {
        columns = null;
        // print warning at least...
      }

      return columns;
    }
  }, {
    key: 'pixelRepresentation',
    value: function pixelRepresentation() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var pixelRepresentation = this._dataSet.uint16('x00280103');
      return pixelRepresentation;
    }
  }, {
    key: 'bitsAllocated',
    value: function bitsAllocated() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      // expect frame index to start at 0!
      var bitsAllocated = this._dataSet.uint16('x00280100');
      return bitsAllocated;
    }
  }, {
    key: 'highBit',
    value: function highBit() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      // expect frame index to start at 0!
      var highBit = this._dataSet.uint16('x00280102');
      return highBit;
    }
  }, {
    key: 'rescaleIntercept',
    value: function rescaleIntercept() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      return this._findFloatStringInFrameGroupSequence('x00289145', 'x00281052', frameIndex);
    }
  }, {
    key: 'rescaleSlope',
    value: function rescaleSlope() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      return this._findFloatStringInFrameGroupSequence('x00289145', 'x00281053', frameIndex);
    }
  }, {
    key: 'windowCenter',
    value: function windowCenter() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      return this._findFloatStringInFrameGroupSequence('x00289132', 'x00281050', frameIndex);
    }
  }, {
    key: 'windowWidth',
    value: function windowWidth() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      return this._findFloatStringInFrameGroupSequence('x00289132', 'x00281051', frameIndex);
    }
  }, {
    key: 'sliceThickness',
    value: function sliceThickness() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      return this._findFloatStringInFrameGroupSequence('x00289110', 'x00180050', frameIndex);
    }
  }, {
    key: 'dimensionIndexValues',
    value: function dimensionIndexValues() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var dimensionIndexValues = [];

      // try to get it from enhanced MR images
      // per-frame functionnal group sequence
      var perFrameFunctionnalGroupSequence = this._dataSet.elements.x52009230;

      if (typeof perFrameFunctionnalGroupSequence !== 'undefined') {
        // NOT A PHILIPS TRICK!
        var philipsPrivateSequence = perFrameFunctionnalGroupSequence.items[frameIndex].dataSet.elements.x00209111.items[0].dataSet;
        var element = philipsPrivateSequence.elements.x00209157;
        // /4 because UL
        var nbValues = element.length / 4;
        for (var i = 0; i < nbValues; i++) {
          dimensionIndexValues.push(philipsPrivateSequence.uint32('x00209157', i));
        }
      } else {
        dimensionIndexValues = null;
      }

      return dimensionIndexValues;
    }
  }, {
    key: 'inStackPositionNumber',
    value: function inStackPositionNumber() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var inStackPositionNumber = null;

      // try to get it from enhanced MR images
      // per-frame functionnal group sequence
      var perFrameFunctionnalGroupSequence = this._dataSet.elements.x52009230;

      if (typeof perFrameFunctionnalGroupSequence !== 'undefined') {
        // NOT A PHILIPS TRICK!
        var philipsPrivateSequence = perFrameFunctionnalGroupSequence.items[frameIndex].dataSet.elements.x00209111.items[0].dataSet;
        inStackPositionNumber = philipsPrivateSequence.uint32('x00209057');
      } else {
        inStackPositionNumber = null;
      }

      return inStackPositionNumber;
    }
  }, {
    key: 'stackID',
    value: function stackID() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var stackID = null;

      // try to get it from enhanced MR images
      // per-frame functionnal group sequence
      var perFrameFunctionnalGroupSequence = this._dataSet.elements.x52009230;

      if (typeof perFrameFunctionnalGroupSequence !== 'undefined') {
        // NOT A PHILIPS TRICK!
        var philipsPrivateSequence = perFrameFunctionnalGroupSequence.items[frameIndex].dataSet.elements.x00209111.items[0].dataSet;
        stackID = philipsPrivateSequence.intString('x00209056');
      } else {
        stackID = null;
      }

      return stackID;
    }
  }, {
    key: 'extractPixelData',
    value: function extractPixelData() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      // decompress
      var decompressedData = this._decodePixelData(frameIndex);

      var numberOfChannels = this.numberOfChannels();
      if (numberOfChannels > 1) {
        return this._convertColorSpace(decompressedData);
      } else {
        return decompressedData;
      }
    }
  }, {
    key: 'minMaxPixelData',
    value: function minMaxPixelData() {
      var pixelData = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var minMax = [65535, -32768];
      var numPixels = pixelData.length;
      for (var index = 0; index < numPixels; index++) {
        var spv = pixelData[index];
        minMax[0] = Math.min(minMax[0], spv);
        minMax[1] = Math.max(minMax[1], spv);
      }

      return minMax;
    }

    //
    // private methods
    //

  }, {
    key: '_findInGroupSequence',
    value: function _findInGroupSequence(sequence, subsequence, index) {
      var functionalGroupSequence = this._dataSet.elements[sequence];

      if (typeof functionalGroupSequence !== 'undefined') {
        var inSequence = functionalGroupSequence.items[index].dataSet.elements[subsequence];

        if (typeof inSequence !== 'undefined') {
          return inSequence.items[0].dataSet;
        }
      }

      return null;
    }
  }, {
    key: '_findStringInGroupSequence',
    value: function _findStringInGroupSequence(sequence, subsequence, tag, index) {
      // index = 0 if shared!!!
      var dataSet = this._findInGroupSequence(sequence, subsequence, index);

      if (dataSet !== null) {
        return dataSet.string(tag);
      }

      return null;
    }
  }, {
    key: '_findStringInFrameGroupSequence',
    value: function _findStringInFrameGroupSequence(subsequence, tag, index) {
      return this._findStringInGroupSequence('x52009229', subsequence, tag, 0) || this._findStringInGroupSequence('x52009230', subsequence, tag, index);
    }
  }, {
    key: '_findStringEverywhere',
    value: function _findStringEverywhere(subsequence, tag, index) {
      var targetString = this._findStringInFrameGroupSequence(subsequence, tag, index);

      if (targetString === null) {
        targetString = this._dataSet.string(tag);
      }

      if (typeof targetString === 'undefined') {
        targetString = null;
      }

      return targetString;
    }
  }, {
    key: '_findFloatStringInGroupSequence',
    value: function _findFloatStringInGroupSequence(sequence, subsequence, tag, index) {

      var dataInGroupSequence = this._dataSet.floatString(tag);

      // try to get it from enhanced MR images
      // per-frame functionnal group
      if (typeof dataInGroupSequence === 'undefined') {
        dataInGroupSequence = this._findInGroupSequence(sequence, subsequence, index);

        if (dataInGroupSequence !== null) {
          return dataInGroupSequence.floatString(tag);
        } else {
          return null;
        }
      }

      return dataInGroupSequence;
    }
  }, {
    key: '_findFloatStringInFrameGroupSequence',
    value: function _findFloatStringInFrameGroupSequence(subsequence, tag, index) {
      return this._findFloatStringInGroupSequence('x52009229', subsequence, tag, 0) || this._findFloatStringInGroupSequence('x52009230', subsequence, tag, index);
    }
  }, {
    key: '_decodePixelData',
    value: function _decodePixelData() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      // if compressed..?
      var transferSyntaxUID = this.transferSyntaxUID();

      // find compression scheme
      if (transferSyntaxUID === '1.2.840.10008.1.2.4.90' || // JPEG 2000 Lossless
      transferSyntaxUID === '1.2.840.10008.1.2.4.91') {
        // JPEG 2000 Lossy
        // JPEG 2000
        return this._decodeJ2K(frameIndex);
      } else if (transferSyntaxUID === '1.2.840.10008.1.2.4.57' || // JPEG Lossless, Nonhierarchical (Processes 14)
      transferSyntaxUID === '1.2.840.10008.1.2.4.70') {
        // JPEG Lossless, Nonhierarchical (Processes 14 [Selection 1])
        // JPEG LOSSLESS
        return this._decodeJPEGLossless(frameIndex);
      } else if (transferSyntaxUID === '1.2.840.10008.1.2.4.50' || // JPEG Baseline lossy process 1 (8 bit)
      transferSyntaxUID === '1.2.840.10008.1.2.4.51') {
        // JPEG Baseline lossy process 2 & 4 (12 bit)
        // JPEG Baseline
        return this._decodeJPEGBaseline(frameIndex);
      } else if (transferSyntaxUID === '1.2.840.10008.1.2' || // Implicit VR Little Endian
      transferSyntaxUID === '1.2.840.10008.1.2.1' || // Explicit VR Little Endian
      transferSyntaxUID === '1.2.840.10008.1.2.2') {
        // Explicit VR Big Endian
        return this._decodeUncompressed(frameIndex);
      } else {
        throw 'no decoder for transfer syntax ${transferSyntaxUID}';
      }
    }
  }, {
    key: '_decodeJ2K',
    value: function _decodeJ2K() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var encodedPixelData = DicomParser.readEncapsulatedPixelData(this._dataSet, this._dataSet.elements.x7fe00010, frameIndex);
      // let pixelDataElement = this._dataSet.elements.x7fe00010;
      // let pixelData = new Uint8Array(this._dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length);
      var jpxImage = new Jpx();
      // https://github.com/OHIF/image-JPEG2000/issues/6
      // It currently returns either Int16 or Uint16 based on whether the codestream is signed or not.
      jpxImage.parse(encodedPixelData);

      // let j2kWidth = jpxImage.width;
      // let j2kHeight = jpxImage.height;

      var componentsCount = jpxImage.componentsCount;
      if (componentsCount !== 1) {
        throw 'JPEG2000 decoder returned a componentCount of ${componentsCount}, when 1 is expected';
      }
      var tileCount = jpxImage.tiles.length;
      if (tileCount !== 1) {
        throw 'JPEG2000 decoder returned a tileCount of ${tileCount}, when 1 is expected';
      }
      var tileComponents = jpxImage.tiles[0];
      var pixelData = tileComponents.items;

      // window.console.log(j2kWidth, j2kHeight);

      return pixelData;
    }

    // from cornerstone

  }, {
    key: '_decodeJPEGLossless',
    value: function _decodeJPEGLossless() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var encodedPixelData = DicomParser.readEncapsulatedPixelData(this._dataSet, this._dataSet.elements.x7fe00010, frameIndex);
      var pixelRepresentation = this.pixelRepresentation(frameIndex);
      var bitsAllocated = this.bitsAllocated(frameIndex);
      var byteOutput = bitsAllocated <= 8 ? 1 : 2;
      var decoder = new Jpeg.lossless.Decoder();
      var decompressedData = decoder.decode(encodedPixelData.buffer, encodedPixelData.byteOffset, encodedPixelData.length, byteOutput);
      if (pixelRepresentation === 0) {
        if (byteOutput === 2) {
          return new Uint16Array(decompressedData.buffer);
        } else {
          // untested!
          return new Uint8Array(decompressedData.buffer);
        }
      } else {
        return new Int16Array(decompressedData.buffer);
      }
    }
  }, {
    key: '_decodeJPEGBaseline',
    value: function _decodeJPEGBaseline() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var encodedPixelData = DicomParser.readEncapsulatedPixelData(this._dataSet, this._dataSet.elements.x7fe00010, frameIndex);
      var rows = this.rows(frameIndex);
      var columns = this.columns(frameIndex);
      var bitsAllocated = this.bitsAllocated(frameIndex);
      var jpegBaseline = new JpegBaseline();
      jpegBaseline.parse(encodedPixelData);
      if (bitsAllocated === 8) {
        return jpegBaseline.getData(columns, rows);
      } else if (bitsAllocated === 16) {
        return jpegBaseline.getData16(columns, rows);
      }
    }
  }, {
    key: '_decodeUncompressed',
    value: function _decodeUncompressed() {
      var frameIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var pixelRepresentation = this.pixelRepresentation(frameIndex);
      var bitsAllocated = this.bitsAllocated(frameIndex);
      var pixelDataElement = this._dataSet.elements.x7fe00010;
      var pixelDataOffset = pixelDataElement.dataOffset;
      var numberOfChannels = this.numberOfChannels();
      var numPixels = this.rows(frameIndex) * this.columns(frameIndex) * numberOfChannels;
      var frameOffset = 0;
      var buffer = this._dataSet.byteArray.buffer;

      if (pixelRepresentation === 0 && bitsAllocated === 8) {

        // unsigned 8 bit
        frameOffset = pixelDataOffset + frameIndex * numPixels;
        return new Uint8Array(buffer, frameOffset, numPixels);
      } else if (pixelRepresentation === 0 && bitsAllocated === 16) {

        // unsigned 16 bit
        frameOffset = pixelDataOffset + frameIndex * numPixels * 2;
        return new Uint16Array(buffer, frameOffset, numPixels);
      } else if (pixelRepresentation === 1 && bitsAllocated === 16) {

        // signed 16 bit
        frameOffset = pixelDataOffset + frameIndex * numPixels * 2;
        return new Int16Array(buffer, frameOffset, numPixels);
      } else if (pixelRepresentation === 0 && bitsAllocated === 32) {

        // unsigned 32 bit
        frameOffset = pixelDataOffset + frameIndex * numPixels * 4;
        return new Int16Array(buffer, frameOffset, numPixels);
      } else if (pixelRepresentation === 0 && bitsAllocated === 1) {
        var newBuffer = new ArrayBuffer(numPixels);
        var newArray = new Uint8Array(newBuffer);

        frameOffset = pixelDataOffset + frameIndex * numPixels;
        var index = 0;

        var bitStart = frameIndex * numPixels;
        var bitEnd = frameIndex * numPixels + numPixels;

        var byteStart = Math.floor(bitStart / 8);
        var bitStartOffset = bitStart - byteStart * 8;
        var byteEnd = Math.ceil(bitEnd / 8);

        var targetBuffer = new Uint8Array(buffer, pixelDataOffset);

        for (var i = byteStart; i <= byteEnd; i++) {
          while (bitStartOffset < 8) {

            switch (bitStartOffset) {
              case 0:
                newArray[index] = targetBuffer[i] & 0x0001;
                break;
              case 1:
                newArray[index] = targetBuffer[i] >>> 1 & 0x0001;
                break;
              case 2:
                newArray[index] = targetBuffer[i] >>> 2 & 0x0001;
                break;
              case 3:
                newArray[index] = targetBuffer[i] >>> 3 & 0x0001;
                break;
              case 4:
                newArray[index] = targetBuffer[i] >>> 4 & 0x0001;
                break;
              case 5:
                newArray[index] = targetBuffer[i] >>> 5 & 0x0001;
                break;
              case 6:
                newArray[index] = targetBuffer[i] >>> 6 & 0x0001;
                break;
              case 7:
                newArray[index] = targetBuffer[i] >>> 7 & 0x0001;
                break;
              default:
                break;
            }

            bitStartOffset++;
            index++;
            // if return..
            if (index >= numPixels) {
              return newArray;
            }
          }
          bitStartOffset = 0;
        }
      }
    }
  }, {
    key: '_convertColorSpace',
    value: function _convertColorSpace(uncompressedData) {
      var rgbData = null;
      var photometricInterpretation = this.photometricInterpretation();
      var planarConfiguration = this.planarConfiguration();

      if (photometricInterpretation === 'RGB' && planarConfiguration === 0) {
        // ALL GOOD, ALREADY ORDERED
        // planar or non planar planarConfiguration
        rgbData = uncompressedData;
      } else if (photometricInterpretation === 'RGB' && planarConfiguration === 1) {
        if (uncompressedData instanceof Int8Array) {
          rgbData = new Int8Array(uncompressedData.length);
        } else if (uncompressedData instanceof Uint8Array) {
          rgbData = new Uint8Array(uncompressedData.length);
        } else if (uncompressedData instanceof Int16Array) {
          rgbData = new Int16Array(uncompressedData.length);
        } else if (uncompressedData instanceof Uint16Array) {
          rgbData = new Uint16Array(uncompressedData.length);
        } else {
          throw 'unsuported typed array: ${uncompressedData}';
        }

        var numPixels = uncompressedData.length / 3;
        var rgbaIndex = 0;
        var rIndex = 0;
        var gIndex = numPixels;
        var bIndex = numPixels * 2;
        for (var i = 0; i < numPixels; i++) {
          rgbData[rgbaIndex++] = uncompressedData[rIndex++]; // red
          rgbData[rgbaIndex++] = uncompressedData[gIndex++]; // green
          rgbData[rgbaIndex++] = uncompressedData[bIndex++]; // blue
        }
      } else if (photometricInterpretation === 'YBR_FULL') {
          if (uncompressedData instanceof Int8Array) {
            rgbData = new Int8Array(uncompressedData.length);
          } else if (uncompressedData instanceof Uint8Array) {
            rgbData = new Uint8Array(uncompressedData.length);
          } else if (uncompressedData instanceof Int16Array) {
            rgbData = new Int16Array(uncompressedData.length);
          } else if (uncompressedData instanceof Uint16Array) {
            rgbData = new Uint16Array(uncompressedData.length);
          } else {
            throw 'unsuported typed array: ${uncompressedData}';
          }

          // https://github.com/chafey/cornerstoneWADOImageLoader/blob/master/src/decodeYBRFull.js
          var nPixels = uncompressedData.length / 3;
          var ybrIndex = 0;
          var _rgbaIndex = 0;
          for (var _i = 0; _i < nPixels; _i++) {
            var y = uncompressedData[ybrIndex++];
            var cb = uncompressedData[ybrIndex++];
            var cr = uncompressedData[ybrIndex++];
            rgbData[_rgbaIndex++] = y + 1.40200 * (cr - 128); // red
            rgbData[_rgbaIndex++] = y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128); // green
            rgbData[_rgbaIndex++] = y + 1.77200 * (cb - 128); // blue
            // rgbData[rgbaIndex++] = 255; //alpha
          }
        } else {
            throw 'photometric interpolation not supported: ${photometricInterpretation}';
          }

      return rgbData;
    }
  }]);

  return ParsersDicom;
}();

// VJS.parsers.dicom.prototype.frameOfReferenceUID = function(imageJqueryDom) {
//   // try to access frame of reference UID through its DICOM tag
//   let seriesNumber = imageJqueryDom.find('[tag="00200052"] Value').text();

//   // if not available, assume we only have 1 frame
//   if (seriesNumber === '') {
//     seriesNumber = 1;
//   }
//   return seriesNumber;
// };

//
// ENDIAN NESS NOT TAKEN CARE OF
// http://stackoverflow.com/questions/5320439/how-do-i-swap-endian-ness-byte-order-of-a-letiable-in-javascript
// http://www.barre.nom.fr/medical/samples/
//
//


exports.default = ParsersDicom;

},{"./jpeg":36,"./jpx":37,"dicom-parser":1,"jpeg-lossless-decoder-js":7}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parsers = require('./parsers.dicom');

var _parsers2 = _interopRequireDefault(_parsers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Dicom: _parsers2.default
};

},{"./parsers.dicom":38}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShadersData = function () {
  function ShadersData() {
    _classCallCheck(this, ShadersData);
  }

  _createClass(ShadersData, null, [{
    key: 'uniforms',
    value: function uniforms() {
      return {
        'uTextureSize': {
          type: 'i',
          value: 0
        },
        'uTextureContainer': {
          type: 'tv',
          value: []
        },
        'uDataDimensions': {
          type: 'iv',
          value: [0, 0, 0]
        },
        'uWorldToData': {
          type: 'm4',
          value: new THREE.Matrix4()
        },
        'uWindowCenterWidth': {
          type: 'fv1',
          value: [0.0, 0.0]
        },
        'uRescaleSlopeIntercept': {
          type: 'fv1',
          value: [0.0, 0.0]
        },
        'uNumberOfChannels': {
          type: 'i',
          value: 1
        },
        'uBitsAllocated': {
          type: 'i',
          value: 8
        },
        'uInvert': {
          type: 'i',
          value: 0
        },
        'uLut': {
          type: 'i',
          value: 0
        },
        'uTextureLUT': {
          type: 't',
          value: []
        }
      };
    }
  }]);

  return ShadersData;
}();

exports.default = ShadersData;

},{}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shadersData = require('./shaders.data.js');

var _shadersData2 = _interopRequireDefault(_shadersData);

var _shadersRaycasting = require('./shaders.raycasting.js');

var _shadersRaycasting2 = _interopRequireDefault(_shadersRaycasting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }



var DataVertex = "#define GLSLIFY 1\nvarying vec4 vPos;\n\n//\n// main\n//\nvoid main() {\n\n  vPos = modelMatrix * vec4(position, 1.0 );\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );\n\n}";
var DataFragment = "#define GLSLIFY 1\nuniform int uTextureSize;\nuniform float uWindowCenterWidth[2];\nuniform float uRescaleSlopeIntercept[2];\nuniform sampler2D uTextureContainer[7];\nuniform ivec3 uDataDimensions;\nuniform mat4 uWorldToData;\nuniform int uNumberOfChannels;\nuniform int uBitsAllocated;\nuniform int uInvert;\n\n// hack because can not pass arrays if too big\n// best would be to pass texture but have to deal with 16bits\nuniform int uLut;\nuniform sampler2D uTextureLUT;\n\nvarying vec4 vPos;\n\n// include functions\nvec4 unpack( vec4 packedRGBA,\n             int bitsAllocated,\n             int signedNumber,\n             int numberOfChannels) {\n  // always return a vec4\n  vec4 unpacked = vec4(0, 0, 0, 0);\n\n  if(numberOfChannels == 1){\n    if(bitsAllocated == 8 || bitsAllocated == 1){\n      unpacked.x = packedRGBA.r * 256.;\n    }\n    else if(bitsAllocated == 16){\n      unpacked.x = packedRGBA.r * 256. + packedRGBA.a * 65536.;\n    }\n    else if(bitsAllocated == 32){\n      unpacked.x = packedRGBA.r * 256. + packedRGBA.g * 65536. + + packedRGBA.b * 16777216. + + packedRGBA.a * 4294967296.;\n    }\n  }\n  else if(numberOfChannels == 3){\n    unpacked = packedRGBA;\n  }\n  return unpacked;\n}\n\n// Support up to textureSize*textureSize*7 voxels\n\nvec4 texture3DPolyfill(ivec3 dataCoordinates,\n                       ivec3 dataDimensions,\n                       int textureSize,\n                       sampler2D textureContainer0,\n                       sampler2D textureContainer1,\n                       sampler2D textureContainer2,\n                       sampler2D textureContainer3,\n                       sampler2D textureContainer4,\n                       sampler2D textureContainer5,\n                       sampler2D textureContainer6,\n                       sampler2D textureContainer[7] // not working on Moto X 2014\n  ) {\n\n  // Model coordinate to data index\n  int index = dataCoordinates.x\n            + dataCoordinates.y * dataDimensions.x\n            + dataCoordinates.z * dataDimensions.y * dataDimensions.x;\n\n  // Map data index to right sampler2D texture\n  int voxelsPerTexture = textureSize*textureSize;\n  int textureIndex = int(floor(float(index) / float(voxelsPerTexture)));\n  // modulo seems incorrect sometimes...\n  // int inTextureIndex = int(mod(float(index), float(textureSize*textureSize)));\n  int inTextureIndex = index - voxelsPerTexture*textureIndex;\n\n  // Get row and column in the texture\n  int colIndex = int(mod(float(inTextureIndex), float(textureSize)));\n  int rowIndex = int(floor(float(inTextureIndex)/float(textureSize)));\n\n  // Map row and column to uv\n  vec2 uv = vec2(0,0);\n  uv.x = (0.5 + float(colIndex)) / float(textureSize);\n  uv.y = 1. - (0.5 + float(rowIndex)) / float(textureSize);\n\n  //\n  vec4 dataValue = vec4(0., 0., 0., 0.);\n  if(textureIndex == 0){ dataValue = texture2D(textureContainer0, uv); }\n  else if(textureIndex == 1){dataValue = texture2D(textureContainer1, uv);}\n  else if(textureIndex == 2){ dataValue = texture2D(textureContainer2, uv); }\n  else if(textureIndex == 3){ dataValue = texture2D(textureContainer3, uv); }\n  else if(textureIndex == 4){ dataValue = texture2D(textureContainer4, uv); }\n  else if(textureIndex == 5){ dataValue = texture2D(textureContainer5, uv); }\n  else if(textureIndex == 6){ dataValue = texture2D(textureContainer6, uv); }\n\n  return dataValue;\n}\n\nvoid main(void) {\n\n  // get texture coordinates of current pixel\n  // doesn't need that in theory\n  vec4 dataCoordinatesRaw = uWorldToData * vPos;\n  // rounding trick\n  // first center of first voxel in data space is CENTERED on (0,0,0)\n  dataCoordinatesRaw += 0.5;\n  ivec3 dataCoordinates = ivec3(int(floor(dataCoordinatesRaw.x)), int(floor(dataCoordinatesRaw.y)), int(floor(dataCoordinatesRaw.z)));\n\n  // if data in range, look it up in the texture!\n  if ( all(greaterThanEqual(dataCoordinates, ivec3(0))) &&\n       all(lessThan(dataCoordinates, uDataDimensions))) {\n    vec4 packedValue = texture3DPolyfill(\n        dataCoordinates,\n        uDataDimensions,\n        uTextureSize,\n        uTextureContainer[0],\n        uTextureContainer[1],\n        uTextureContainer[2],\n        uTextureContainer[3],\n        uTextureContainer[4],\n        uTextureContainer[5],\n        uTextureContainer[6],\n        uTextureContainer     // not working on Moto X 2014\n        );\n\n    vec4 dataValue = unpack(packedValue, uBitsAllocated, 0, uNumberOfChannels);\n\n    // how do we deal wil more than 1 channel?\n    if(uNumberOfChannels == 1){\n      float intensity = dataValue.r;\n\n      // rescale/slope\n      intensity = intensity*uRescaleSlopeIntercept[0] + uRescaleSlopeIntercept[1];\n\n      // window level\n      float windowMin = uWindowCenterWidth[0] - uWindowCenterWidth[1] * 0.5;\n      float windowMax = uWindowCenterWidth[0] + uWindowCenterWidth[1] * 0.5;\n      intensity = ( intensity - windowMin ) / uWindowCenterWidth[1];\n\n      dataValue.r = dataValue.g = dataValue.b = intensity;\n    }\n\n    // Apply LUT table...\n    //\n    if(uLut == 1){\n      // should opacity be grabbed there?\n      dataValue = texture2D( uTextureLUT, vec2( dataValue.r , 1.0) );\n    }\n\n    if(uInvert == 1){\n      dataValue = vec4(1.) - dataValue;\n      // how do we deal with that and opacity?\n      dataValue.a = 1.;\n    }\n\n    gl_FragColor = dataValue;\n\n  }\n  else{\n    // should be able to choose what we want to do if not in range:\n    // discard or specific color\n    // discard;\n    gl_FragColor = vec4(0.011, 0.662, 0.956, 1.0);\n  }\n}";

var RaycastingFirstpassFragment = "#define GLSLIFY 1\nuniform float uWorldBBox[6];\n\nvarying vec4 vPos;\n\nvoid main(void) {\n\n  // NORMALIZE LPS VALUES\n  gl_FragColor = vec4((vPos.x - uWorldBBox[0])/(uWorldBBox[1] - uWorldBBox[0]),\n                      (vPos.y - uWorldBBox[2])/(uWorldBBox[3] - uWorldBBox[2]),\n                      (vPos.z - uWorldBBox[4])/(uWorldBBox[5] - uWorldBBox[4]),\n                      1.0);\n\n  // if((vPos.x - uWorldBBox[0])/(uWorldBBox[1] - uWorldBBox[0]) > 1. ||\n  //    (vPos.y - uWorldBBox[2])/(uWorldBBox[3] - uWorldBBox[2]) > 1. ||\n  //    (vPos.z - uWorldBBox[4])/(uWorldBBox[5] - uWorldBBox[4]) > 1.){\n  //    gl_FragColor = vec4(0., 0., 0., 0.);\n  // }\n}";
var RaycastingSecondpassVertex = "#define GLSLIFY 1\nvarying vec4 vPos;\nvarying vec4 vProjectedCoords;\n//\n// main\n//\nvoid main() {\n\n  vPos = modelMatrix * vec4(position, 1.0 );\n  vProjectedCoords =  projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );\n\n}";
var RaycastingSecondpassFragment = "#define GLSLIFY 1\nuniform int uTextureSize;\nuniform float uWindowCenterWidth[2];\nuniform float uRescaleSlopeIntercept[2];\nuniform sampler2D uTextureContainer[7];\nuniform ivec3 uDataDimensions;\nuniform mat4 uWorldToData;\nuniform int uNumberOfChannels;\nuniform int uBitsAllocated;\nuniform float uWorldBBox[6];\nuniform sampler2D uTextureBack;\nuniform int uSteps;\nuniform int uLut;\nuniform sampler2D uTextureLUT;\nuniform float uAlphaCorrection;\nuniform float uFrequence;\nuniform float uAmplitude;\n\nvarying vec4 vPos;\nvarying vec4 vProjectedCoords;\n\n// include functions\nvec4 unpack( vec4 packedRGBA,\n             int bitsAllocated,\n             int signedNumber,\n             int numberOfChannels) {\n  // always return a vec4\n  vec4 unpacked = vec4(0, 0, 0, 0);\n\n  if(numberOfChannels == 1){\n    if(bitsAllocated == 8 || bitsAllocated == 1){\n      unpacked.x = packedRGBA.r * 256.;\n    }\n    else if(bitsAllocated == 16){\n      unpacked.x = packedRGBA.r * 256. + packedRGBA.a * 65536.;\n    }\n    else if(bitsAllocated == 32){\n      unpacked.x = packedRGBA.r * 256. + packedRGBA.g * 65536. + + packedRGBA.b * 16777216. + + packedRGBA.a * 4294967296.;\n    }\n  }\n  else if(numberOfChannels == 3){\n    unpacked = packedRGBA;\n  }\n  return unpacked;\n}\n\n// Support up to textureSize*textureSize*7 voxels\n\nvec4 texture3DPolyfill(ivec3 dataCoordinates,\n                       ivec3 dataDimensions,\n                       int textureSize,\n                       sampler2D textureContainer0,\n                       sampler2D textureContainer1,\n                       sampler2D textureContainer2,\n                       sampler2D textureContainer3,\n                       sampler2D textureContainer4,\n                       sampler2D textureContainer5,\n                       sampler2D textureContainer6,\n                       sampler2D textureContainer[7] // not working on Moto X 2014\n  ) {\n\n  // Model coordinate to data index\n  int index = dataCoordinates.x\n            + dataCoordinates.y * dataDimensions.x\n            + dataCoordinates.z * dataDimensions.y * dataDimensions.x;\n\n  // Map data index to right sampler2D texture\n  int voxelsPerTexture = textureSize*textureSize;\n  int textureIndex = int(floor(float(index) / float(voxelsPerTexture)));\n  // modulo seems incorrect sometimes...\n  // int inTextureIndex = int(mod(float(index), float(textureSize*textureSize)));\n  int inTextureIndex = index - voxelsPerTexture*textureIndex;\n\n  // Get row and column in the texture\n  int colIndex = int(mod(float(inTextureIndex), float(textureSize)));\n  int rowIndex = int(floor(float(inTextureIndex)/float(textureSize)));\n\n  // Map row and column to uv\n  vec2 uv = vec2(0,0);\n  uv.x = (0.5 + float(colIndex)) / float(textureSize);\n  uv.y = 1. - (0.5 + float(rowIndex)) / float(textureSize);\n\n  //\n  vec4 dataValue = vec4(0., 0., 0., 0.);\n  if(textureIndex == 0){ dataValue = texture2D(textureContainer0, uv); }\n  else if(textureIndex == 1){dataValue = texture2D(textureContainer1, uv);}\n  else if(textureIndex == 2){ dataValue = texture2D(textureContainer2, uv); }\n  else if(textureIndex == 3){ dataValue = texture2D(textureContainer3, uv); }\n  else if(textureIndex == 4){ dataValue = texture2D(textureContainer4, uv); }\n  else if(textureIndex == 5){ dataValue = texture2D(textureContainer5, uv); }\n  else if(textureIndex == 6){ dataValue = texture2D(textureContainer6, uv); }\n\n  return dataValue;\n}\n\nvec3 transformPoint(const in vec3 samplePoint, const in float frequency, const in float amplitude)\n// Apply a spatial transformation to a world space point\n{\n  return samplePoint + amplitude * vec3(samplePoint.x * sin(frequency * samplePoint.z),\n                                        samplePoint.y * cos(frequency * samplePoint.z),\n                                        0);\n}\n\n// needed for glslify\n\nfloat getIntensity(ivec3 dataCoordinates){\n\n  vec4 packedValue = texture3DPolyfill(\n    dataCoordinates,\n    uDataDimensions,\n    uTextureSize,\n    uTextureContainer[0],\n    uTextureContainer[1],\n    uTextureContainer[2],\n    uTextureContainer[3],\n    uTextureContainer[4],\n    uTextureContainer[5],\n    uTextureContainer[6],\n    uTextureContainer     // not working on Moto X 2014\n    );\n\n  vec4 dataValue = unpack(packedValue, uBitsAllocated, 0, uNumberOfChannels);\n  float intensity = dataValue.r;\n\n  // rescale/slope\n  intensity = intensity*uRescaleSlopeIntercept[0] + uRescaleSlopeIntercept[1];\n  // window level\n  float windowMin = uWindowCenterWidth[0] - uWindowCenterWidth[1] * 0.5;\n  // float windowMax = uWindowCenterWidth[0] + uWindowCenterWidth[1] * 0.5;\n  intensity = ( intensity - windowMin ) / uWindowCenterWidth[1];\n\n  return intensity;\n}\n\nvoid main(void) {\n  const int maxSteps = 1024;\n\n  //\n  vec2 texc = vec2(((vProjectedCoords.x / vProjectedCoords.w) + 1.0 ) / 2.0,\n                ((vProjectedCoords.y / vProjectedCoords.w) + 1.0 ) / 2.0 );\n  //The back position is the world space position stored in the texture.\n  vec3 backPosNormalized = texture2D(uTextureBack, texc).xyz;\n  //\n  vec3 backPos = vec3(backPosNormalized.x * (uWorldBBox[1] - uWorldBBox[0]) + uWorldBBox[0],\n                     backPosNormalized.y * (uWorldBBox[3] - uWorldBBox[2]) + uWorldBBox[2],\n                     backPosNormalized.z * (uWorldBBox[5] - uWorldBBox[4]) + uWorldBBox[4]);\n  vec3 frontPos = vec3(vPos.x, vPos.y, vPos.z);\n\n  // init the ray\n  vec3 rayDir = backPos - frontPos;\n  float rayLength = length(rayDir);\n\n  // init the delta\n  float delta = 1.0 / float(uSteps);\n  vec3  deltaDirection = rayDir * delta;\n  float deltaDirectionLength = length(deltaDirection);\n\n  // init the ray marching\n  vec3 currentPosition = frontPos;\n  vec4 accumulatedColor = vec4(0.0);\n  float accumulatedAlpha = 0.0;\n  float accumulatedLength = 0.0;\n\n  // color and alpha at intersection\n  vec4 colorSample;\n  float alphaSample;\n  float gradientLPS = 1.;\n  for(int rayStep = 0; rayStep < maxSteps; rayStep++){\n\n    // get data value at given location\n    // need a function/polyfill to hide it\n\n    // get texture coordinates of current pixel\n    // doesn't need that in theory\n    vec3 currentPosition2 = transformPoint(currentPosition, uAmplitude, uFrequence);\n    vec4 currentPos4 = vec4(currentPosition2, 1.0);\n\n    vec4 dataCoordinatesRaw = uWorldToData * currentPos4;\n    // rounding trick\n    // first center of first voxel in data space is CENTERED on (0,0,0)\n    dataCoordinatesRaw += 0.5;\n    ivec3 dataCoordinates = ivec3(int(floor(dataCoordinatesRaw.x)), int(floor(dataCoordinatesRaw.y)), int(floor(dataCoordinatesRaw.z)));\n\n    if ( all(greaterThanEqual(dataCoordinates, ivec3(0))) &&\n         all(lessThan(dataCoordinates, uDataDimensions))) {\n      float intensity = getIntensity(dataCoordinates);\n\n      // compute gradient\n      // // vec4 sP00lps = currentPos4 + vec4(gradientLPS, 0, 0, 0);\n      // // vec4 sP00ijkRaw = uWorldToData * sP00lps;\n      // // sP00ijkRaw += 0.5;\n      // // ivec3 sP00ijk = ivec3(int(floor(sP00ijkRaw.x)), int(floor(sP00ijkRaw.y)), int(floor(sP00ijkRaw.z)));\n      // ivec3 sP00ijk = dataCoordinates + ivec3(gradientLPS, 0, 0);\n      // float sP00 = getIntensity(sP00ijk);\n\n      // // vec4 sN00lps = currentPos4 - vec4(gradientLPS, 0, 0, 0);\n      // // vec4 sN00ijkRaw = uWorldToData * sN00lps;\n      // // sN00ijkRaw += 0.5;\n      // // ivec3 sN00ijk = ivec3(int(floor(sN00ijkRaw.x)), int(floor(sN00ijkRaw.y)), int(floor(sN00ijkRaw.z)));\n      // ivec3 sN00ijk = dataCoordinates - ivec3(gradientLPS, 0, 0);\n      // float sN00 = getIntensity(sN00ijk);\n\n      // // vec4 s0P0lps = currentPos4 + vec4(0, gradientLPS, 0, 0);\n      // // vec4 s0P0ijkRaw = uWorldToData * s0P0lps;\n      // // s0P0ijkRaw += 0.5;\n      // // ivec3 s0P0ijk = ivec3(int(floor(s0P0ijkRaw.x)), int(floor(s0P0ijkRaw.y)), int(floor(s0P0ijkRaw.z)));\n      // ivec3 s0P0ijk = dataCoordinates + ivec3(0, gradientLPS, 0);\n      // float s0P0 = getIntensity(s0P0ijk);\n\n      // // vec4 s0N0lps = currentPos4 - vec4(0, gradientLPS, 0, 0);\n      // // vec4 s0N0ijkRaw = uWorldToData * s0N0lps;\n      // // s0N0ijkRaw += 0.5;\n      // // ivec3 s0N0ijk = ivec3(int(floor(s0N0ijkRaw.x)), int(floor(s0N0ijkRaw.y)), int(floor(s0N0ijkRaw.z)));\n      // ivec3 s0N0ijk = dataCoordinates - ivec3(0, gradientLPS, 0);\n      // float s0N0 = getIntensity(s0N0ijk);\n\n      // // vec4 s00Plps = currentPos4 + vec4(0, 0, gradientLPS, 0);\n      // // vec4 s00PijkRaw = uWorldToData * s00Plps;\n      // // s00PijkRaw += 0.5;\n      // // ivec3 s00Pijk = ivec3(int(floor(s00PijkRaw.x)), int(floor(s00PijkRaw.y)), int(floor(s00PijkRaw.z)));\n      // ivec3 s00Pijk  = dataCoordinates + ivec3(0, 0, gradientLPS);\n      // float s00P = getIntensity(s00Pijk);\n\n      // // vec4 s00Nlps = currentPos4 - vec4(0, 0, gradientLPS, 0);\n      // // vec4 s00NijkRaw = uWorldToData * s00Nlps;\n      // // s00NijkRaw += 0.5;\n      // // ivec3 s00Nijk = ivec3(int(floor(s00NijkRaw.x)), int(floor(s00NijkRaw.y)), int(floor(s00NijkRaw.z)));\n      // ivec3 s00Nijk  = dataCoordinates - ivec3(0, 0, gradientLPS);\n      // float s00N = getIntensity(s00Nijk);\n\n      // // gradient in IJK space\n      // vec3 gradient = vec3( (sP00-sN00), (s0P0-s0N0), (s00P-s00N));\n      // float gradientMagnitude = length(gradient);\n      // // back to LPS\n\n      // vec3 normal = -1. * normalize(gradient);\n\n      // float dotP = dot(deltaDirection, gradient);\n\n      // float sN00 = textureSampleDenormalized(volumeSampler, stpPoint - vec3(gradientSize,0,0));\n      // float s0P0 = textureSampleDenormalized(volumeSampler, stpPoint + vec3(0,gradientSize,0));\n      // float s0N0 = textureSampleDenormalized(volumeSampler, stpPoint - vec3(0,gradientSize,0));\n      // float s00P = textureSampleDenormalized(volumeSampler, stpPoint + vec3(0,0,gradientSize));\n      // float s00N = textureSampleDenormalized(volumeSampler, stpPoint - vec3(0,0,gradientSize));\n\n      if(uLut == 1){\n        vec4 test = texture2D( uTextureLUT, vec2( intensity, 1.0) );\n        // 256 colors\n        colorSample.r = test.r;//test.a;\n        colorSample.g = test.g;//test.a;\n        colorSample.b = test.b;///test.a;\n        alphaSample = test.a;\n\n//         if(abs(intensity - test.a) > .5){\n// colorSample.r = 1.;\n//         colorSample.g = 0.;\n//         colorSample.b = 0.;\n//         }\n      }\n      else{\n        alphaSample = intensity;\n        colorSample.r = colorSample.g = colorSample.b = intensity * alphaSample;\n      }\n\n      alphaSample = alphaSample * uAlphaCorrection;\n      alphaSample *= (1.0 - accumulatedAlpha);\n\n      // we have the intensity now\n      // colorSample.x = colorSample.y = colorSample.z = intensity;\n      // use a dummy alpha for now\n      // alphaSample = intensity;\n      // if(alphaSample < 0.15){\n      //   alphaSample = 0.;\n      // }\n\n      //Perform the composition.\n      // (1.0 - accumulatedAlpha) *\n      accumulatedColor += alphaSample * colorSample;// * alphaSample;\n\n//       if(accumulatedColor.y > .2){\n// accumulatedColor.y = accumulatedColor.z = 0.;\n//       }\n      // accumulatedColor = vec4((currentPosition.x - uWorldBBox[0])/(uWorldBBox[1] - uWorldBBox[0]),\n      //                (currentPosition.y - uWorldBBox[2])/(uWorldBBox[3] - uWorldBBox[2]),\n      //                (currentPosition.z - uWorldBBox[4])/(uWorldBBox[5] - uWorldBBox[4]),\n      //                1.0);\n      //Store the alpha accumulated so far.\n      accumulatedAlpha += alphaSample;\n      // accumulatedAlpha += 1.0;\n\n    }\n\n    //Advance the ray.\n    currentPosition += deltaDirection;\n    accumulatedLength += deltaDirectionLength;\n\n    if(accumulatedLength >= rayLength || accumulatedAlpha >= 1.0 ) break;\n  }\n\n  // debugging stuff...\n  // gl_FragColor = accumulatedColor;\n  // vec4 fn = vec4((frontPos.x - uWorldBBox[0])/(uWorldBBox[1] - uWorldBBox[0]),\n  //                     (frontPos.y - uWorldBBox[2])/(uWorldBBox[3] - uWorldBBox[2]),\n  //                     (frontPos.z - uWorldBBox[4])/(uWorldBBox[5] - uWorldBBox[4]),\n  //                     0.0);\n  // gl_FragColor = fn;\n\n  // vec4 bn = vec4((backPos.x - uWorldBBox[0])/(uWorldBBox[1] - uWorldBBox[0]),\n  //                     (backPos.y - uWorldBBox[2])/(uWorldBBox[3] - uWorldBBox[2]),\n  //                     (backPos.z - uWorldBBox[4])/(uWorldBBox[5] - uWorldBBox[4]),\n  //                     1.0);\n  // gl_FragColor = bn;\n\n  // gl_FragColor = bn - fn;\n  // gl_FragColor = vec4(dirN, 1.);\n  // gl_FragColor = vec4(currentPosition.x, currentPosition.y, 1., 1.);\n  // gl_FragColor = vec4(1. - dirN, 1.0);\n  // gl_FragColor = vec4((currentPosition.x - uWorldBBox[0])/(uWorldBBox[1] - uWorldBBox[0]),\n  //                     (currentPosition.y - uWorldBBox[2])/(uWorldBBox[3] - uWorldBBox[2]),\n  //                     (currentPosition.z - uWorldBBox[4])/(uWorldBBox[5] - uWorldBBox[4]),\n  //                     1.0);\n\n  // if(accumulatedAlpha < 0.1){\n  //   discard;\n  // }\n  gl_FragColor = vec4(accumulatedColor.xyz, accumulatedAlpha);\n}";

exports.default = {

  DataUniforms: _shadersData2.default,
  DataVertex: DataVertex,
  DataFragment: DataFragment,

  RaycastingUniforms: _shadersRaycasting2.default,
  RaycastingFirstpassFragment: RaycastingFirstpassFragment,
  RaycastingSecondpassVertex: RaycastingSecondpassVertex,
  RaycastingSecondpassFragment: RaycastingSecondpassFragment
};

},{"./shaders.data.js":40,"./shaders.raycasting.js":42}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShadersRaycating = function () {
  function ShadersRaycating() {
    _classCallCheck(this, ShadersRaycating);
  }

  _createClass(ShadersRaycating, null, [{
    key: 'firstPassUniforms',
    value: function firstPassUniforms() {
      return {
        'uWorldBBox': {
          type: 'fv1',
          value: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        }
      };
    }
  }, {
    key: 'secondPassUniforms',
    value: function secondPassUniforms() {
      return {
        'uTextureSize': {
          type: 'i',
          value: 0
        },
        'uTextureContainer': {
          type: 'tv',
          value: []
        },
        'uDataDimensions': {
          type: 'iv',
          value: [0, 0, 0]
        },
        'uWorldToData': {
          type: 'm4',
          value: new THREE.Matrix4()
        },
        'uWindowCenterWidth': {
          type: 'fv1',
          value: [0.0, 0.0]
        },
        'uRescaleSlopeIntercept': {
          type: 'fv1',
          value: [0.0, 0.0]
        },
        'uNumberOfChannels': {
          type: 'i',
          value: 1
        },
        'uBitsAllocated': {
          type: 'i',
          value: 8
        },
        'uTextureBack': {
          type: 't',
          value: null
        },
        'uWorldBBox': {
          type: 'fv1',
          value: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        },
        'uSteps': {
          type: 'i',
          value: 128
        },
        'uLut': {
          type: 'i',
          value: 0
        },
        'uTextureLUT': {
          type: 't',
          value: []
        },
        'uAlphaCorrection': {
          type: 'f',
          value: 1.0
        },
        'uFrequence': {
          type: 'f',
          value: 0.0
        },
        'uAmplitude': {
          type: 'f',
          value: 0.0
        }
      };
    }
  }]);

  return ShadersRaycating;
}();

exports.default = ShadersRaycating;

},{}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cameras = require('./cameras/cameras');

var _cameras2 = _interopRequireDefault(_cameras);

var _controls = require('./controls/controls');

var _controls2 = _interopRequireDefault(_controls);

var _core = require('./core/core');

var _core2 = _interopRequireDefault(_core);

var _geometries = require('./geometries/geometries');

var _geometries2 = _interopRequireDefault(_geometries);

var _helpers = require('./helpers/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _loaders = require('./loaders/loaders');

var _loaders2 = _interopRequireDefault(_loaders);

var _models = require('./models/models');

var _models2 = _interopRequireDefault(_models);

var _parsers = require('./parsers/parsers');

var _parsers2 = _interopRequireDefault(_parsers);

var _shaders = require('./shaders/shaders');

var _shaders2 = _interopRequireDefault(_shaders);

var _widgets = require('./widgets/widgets');

var _widgets2 = _interopRequireDefault(_widgets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Cameras: _cameras2.default,
  Controls: _controls2.default,
  Core: _core2.default,
  Geometries: _geometries2.default,
  Helpers: _helpers2.default,
  Loaders: _loaders2.default,
  Models: _models2.default,
  Parsers: _parsers2.default,
  Shaders: _shaders2.default,
  Widgets: _widgets2.default
};

},{"./cameras/cameras":12,"./controls/controls":14,"./core/core":18,"./geometries/geometries":19,"./helpers/helpers":24,"./loaders/loaders":30,"./models/models":32,"./parsers/parsers":39,"./shaders/shaders":41,"./widgets/widgets":44}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _widgets = require('./widgets.voxelProbe');

var _widgets2 = _interopRequireDefault(_widgets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  VoxelProbe: _widgets2.default
};

},{"./widgets.voxelProbe":45}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('../../src/helpers/helpers.voxel');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WidgetsVoxelProbe = function (_THREE$Object3D) {
  _inherits(WidgetsVoxelProbe, _THREE$Object3D);

  function WidgetsVoxelProbe(stack, targetMesh, controls, camera, container) {
    _classCallCheck(this, WidgetsVoxelProbe);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WidgetsVoxelProbe).call(this));

    _this._enabled = true;

    _this._targetMesh = targetMesh;
    _this._stack = stack;
    _this._container = container;
    _this._controls = controls;
    _this._camera = camera;
    _this._mouse = {
      x: 0,
      y: 0,
      screenX: 0,
      screenY: 0
    };
    // show only voxels that interesect the mesh
    _this._showFrame = -1;

    _this._raycaster = new THREE.Raycaster();
    _this._draggingMouse = false;
    _this._active = -1;
    _this._hover = -1;
    _this._closest = null;
    _this._selected = [];

    _this._voxels = [];
    _this._current = new _helpers2.default(stack.worldCenter(), stack);
    _this._current._showVoxel = true;
    _this._current._showDomSVG = true;
    _this._current._showDomMeasurements = true;

    _this.add(_this._current);

    // event listeners
    _this._container.addEventListener('mousedown', _this.onMouseDown.bind(_this), false);
    _this._container.addEventListener('mouseup', _this.onMouseUp.bind(_this), false);
    _this._container.addEventListener('mousemove', _this.onMouseMove.bind(_this), false);

    _this._container.addEventListener('mousewheel', _this.onMouseMove.bind(_this), false);
    _this._container.addEventListener('DOMMouseScroll', _this.onMouseMove.bind(_this), false); // firefox

    window.addEventListener('keypress', _this.onKeyPress.bind(_this), false);

    _this._defaultColor = '0x00B0FF';
    _this._activeColor = '0xFFEB3B';
    _this._hoverColor = '0xF50057';
    _this._selectedColor = '0x76FF03';

    _this._showVoxel = true;
    _this._showDomSVG = true;
    _this._showDomMeasurements = true;
    return _this;
  }

  _createClass(WidgetsVoxelProbe, [{
    key: 'isEnabled',
    value: function isEnabled() {}
  }, {
    key: 'onKeyPress',
    value: function onKeyPress(event) {
      if (this._enabled === false) {
        return;
      }

      if (event.keyCode === 100) {
        this.deleteAllSelected();
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove() {

      if (this._enabled === false) {
        return;
      }

      this.updateRaycaster(this._raycaster, event, this._container);

      this._draggingMouse = true;

      this.update();
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(event) {

      if (this._enabled === false) {
        return;
      }

      this.updateRaycaster(this._raycaster, event, this._container);

      this._draggingMouse = false;

      this.activateVoxel();
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(event) {

      if (this._enabled === false) {
        return;
      }

      this.updateRaycaster(this._raycaster, event, this._container);

      if (this._draggingMouse === false) {
        if (this._active === -1) {
          // create voxel
          this.createVoxel();
        } else {
          // select / unselect voxel
          this.selectVoxel();
          // disactivate voxel
          this.activateVoxel();
        }
      } else {
        if (this._active >= 0) {
          this.activateVoxel();
        }
      }
    }
  }, {
    key: 'updateRaycaster',
    value: function updateRaycaster(raycaster, event, container) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      this._mouse = {
        x: event.clientX / container.offsetWidth * 2 - 1,
        y: -(event.clientY / container.offsetHeight) * 2 + 1,
        screenX: event.clientX,
        screenY: event.clientY
      };
      // update the raycaster
      raycaster.setFromCamera(this._mouse, this._camera);
    }
  }, {
    key: 'updateColor',
    value: function updateColor(voxel) {
      if (voxel._active) {
        voxel.color = this._activeColor;
      } else if (voxel.hover) {
        voxel.color = this._hoverColor;
      } else if (voxel.selected) {
        voxel.color = this._selectedColor;
      } else {
        voxel.color = this._defaultColor;
      }
    }
  }, {
    key: 'deleteAllSelected',
    value: function deleteAllSelected() {
      var i = this._voxels.length;
      while (i--) {
        var match = this._selected.indexOf(i);
        if (match >= 0) {

          // selected && active
          if (this._active === i) {
            this._active = -1;
          }

          this.remove(this._voxels[i]);
          this._voxels[i].removeTest();
          this._voxels.splice(i, 1);
        }
      }

      this._selected = [];
      this._closest = null;
    }
  }, {
    key: 'selectVoxel',
    value: function selectVoxel() {
      // select/unselect the active voxel
      var selIndex = this._selected.indexOf(this._active);
      if (selIndex === -1) {
        this._selected.push(this._active);
        this._voxels[this._active].selected = true;
        this.updateColor(this._voxels[this._active]);
      } else {
        this._selected.splice(selIndex, 1);
        this._voxels[this._active].selected = false;
      }
    }
  }, {
    key: 'activateVoxel',
    value: function activateVoxel() {
      if (this._active === -1) {
        // Look for intersection against target mesh
        var intersects = this._raycaster.intersectObject(this._targetMesh);

        if (intersects.length > 0) {
          if (this._hover >= 0 || this._closest !== null && this._voxels[this._closest].distance < 10) {
            var index = Math.max(this._hover, this._closest);
            // Active voxel
            this._voxels[index]._active = true;
            this.updateColor(this._voxels[index]);
            this._active = index;
            // Disable controls
            this._controls.enabled = false;
          }
        }
      } else {
        // change color + select it and nothing else selected
        this._voxels[this._active].active = false;
        this._active = -1;
        // Enable controls
        this._controls.enabled = true;
      }
    }
  }, {
    key: 'createVoxel',
    value: function createVoxel() {
      if (this._hover >= 0) {
        return;
      }

      // Look for intersection against target mesh
      var intersects = this._raycaster.intersectObject(this._targetMesh);

      if (intersects.length > 0) {
        // create voxel helper
        var helpersVoxel = new _helpers2.default(intersects[0].point, this._stack);
        this.add(helpersVoxel);

        // push it
        this._voxels.push(helpersVoxel);

        // add hover colors
        helpersVoxel.updateVoxelScreenCoordinates(this._camera, this._container);
        this.hoverVoxel(helpersVoxel, this._mouse, this._current.voxel.dataCoordinates);
        this.updateColor(helpersVoxel);
        helpersVoxel.updateDom(this._container);

        // show/hide mesh
        helpersVoxel.showVoxel = this._showVoxel;
        // show/hide dom stuff
        helpersVoxel.showDomSVG = this._showDomSVG;
        helpersVoxel.showDomMeasurements = this._showDomMeasurements;
      }
    }
  }, {
    key: 'update',
    value: function update() {
      // good to go
      if (!this._targetMesh) {
        return;
      }

      var intersects = this._raycaster.intersectObject(this._targetMesh);

      if (intersects.length > 0) {
        // modify world position with getter/setter
        this._current.worldCoordinates = intersects[0].point;
        this._current.updateVoxelScreenCoordinates(this._camera, this._container);
        this.updateColor(this._current);
        this._current.updateDom(this._container);
        // show/hide mesh
        this._current.showVoxel = this._showVoxel;
        // show/hide dom stuff
        this._current.showDomSVG = this._showDomSVG;
        this._current.showDomMeasurements = this._showDomMeasurements;

        //  if dragging a voxel
        if (this._active >= 0) {
          this._voxels[this._active].worldCoordinates = intersects[0].point;
        }
      }

      // no geometry related updates
      // just colors for hover, etc.
      // and DOM
      this.updateVoxels();
    }
  }, {
    key: 'updateVoxels',
    value: function updateVoxels() {
      var hover = -1;
      var closest = null;

      for (var i = 0; i < this._voxels.length; i++) {
        // update voxel content
        this._voxels[i].updateVoxelScreenCoordinates(this._camera, this._container);
        // update hover status
        this.hoverVoxel(this._voxels[i], this._mouse, this._current.voxel.dataCoordinates);
        this.updateColor(this._voxels[i]);

        // only works if slice is a frame...
        // should test intersection of voxel with target mesh (i.e. plane, box, sphere, etc...)
        // maybe use the raycasting somehow....
        this.showOfIntersectsFrame(this._voxels[i], this._showFrame);
        this._voxels[i].updateDom(this._container);

        // hovering?
        if (this._voxels[i].hover) {
          hover = i;
        }

        // closest pixel to the mouse?
        if (closest === null || this._voxels[i].distance < this._voxels[closest].distance) {
          closest = i;
        }

        // show hide mesh
        this._voxels[i].showVoxel = this._showVoxel;
        // show/hide dom stuff
        this._voxels[i].showDomSVG = this._showDomSVG;
        this._voxels[i].showDomMeasurements = this._showDomMeasurements;
      }

      this._hover = hover;
      this._closest = closest;
    }
  }, {
    key: 'hoverVoxel',
    value: function hoverVoxel(helpersVoxel, mouseScreenCoordinates, currentDataCoordinates) {
      // update hover voxel
      if (helpersVoxel.voxel.dataCoordinates.x === currentDataCoordinates.x && helpersVoxel.voxel.dataCoordinates.y === currentDataCoordinates.y && helpersVoxel.voxel.dataCoordinates.z === currentDataCoordinates.z) {
        helpersVoxel.hover = true;
      } else {
        // update distance mouse/this._voxel
        var dx = mouseScreenCoordinates.screenX - helpersVoxel.voxel.screenCoordinates.x;
        var dy = mouseScreenCoordinates.screenY - helpersVoxel.voxel.screenCoordinates.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        helpersVoxel.distance = distance;
        if (distance >= 0 && distance < 10) {
          helpersVoxel.hover = true;
        } else {
          helpersVoxel.hover = false;
        }
      }
    }
  }, {
    key: 'showOfIntersectsFrame',
    value: function showOfIntersectsFrame(voxelHelper, frameIndex) {
      if (frameIndex === voxelHelper.voxel.dataCoordinates.z || frameIndex === -1) {
        voxelHelper._showDomSVG = true;
        voxelHelper._showDomMeasurements = true;
      } else {
        voxelHelper._showDomSVG = false;
        voxelHelper._showDomMeasurements = false;
      }
    }
  }, {
    key: 'defaultColor',
    set: function set(defaultColor) {
      this._defaultColor = defaultColor;
      this.update();
    },
    get: function get() {
      return this._defaultColor;
    }
  }, {
    key: 'activeColor',
    set: function set(activeColor) {
      this._activeColor = activeColor;
      this.update();
    },
    get: function get() {
      return this._activeColor;
    }
  }, {
    key: 'hoverColor',
    set: function set(hoverColor) {
      this._hoverColor = hoverColor;
      this.update();
    },
    get: function get() {
      return this._hoverColor;
    }
  }, {
    key: 'selectedColor',
    set: function set(selectedColor) {
      this._selectedColor = selectedColor;
      this.update();
    },
    get: function get() {
      return this._selectedColor;
    }
  }, {
    key: 'showVoxel',
    set: function set(showVoxel) {
      this._showVoxel = showVoxel;
      this.update();
    },
    get: function get() {
      return this._showVoxel;
    }
  }, {
    key: 'showDomSVG',
    set: function set(showDomSVG) {
      this._showDomSVG = showDomSVG;
      this.update();
    },
    get: function get() {
      return this._showDomSVG;
    }
  }, {
    key: 'showDomMeasurements',
    set: function set(showDomMeasurements) {
      this._showDomMeasurements = showDomMeasurements;
      this.update();
    },
    get: function get() {
      return this._showDomMeasurements;
    }
  }]);

  return WidgetsVoxelProbe;
}(THREE.Object3D);

exports.default = WidgetsVoxelProbe;

},{"../../src/helpers/helpers.voxel":28}]},{},[43])(43)
});


//# sourceMappingURL=vjs.js.map
