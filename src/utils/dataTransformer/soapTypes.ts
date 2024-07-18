// Source: https://developer.salesforce.com/docs/atlas.en-us.248.0.api.meta/api/sforce_api_calls_describesobjects_describesobjectresult.htm#SOAPType
export enum SoapTypes {
    // Unique ID associated with an sObject. For information on IDs, see Field Types.
    id = 'tns:ID',
    // Can be ID, Boolean, double, integer, string, date, or dateTime.
    anyType = 'xsd:anyType',
    // Base 64-encoded binary data.
    base64Binary = 'xsd:base64Binary',
    // Boolean (true / false) values.
    boolean = 'xsd:boolean',
    // Date values.
    date = 'xsd:date',
    // Date/time values.
    dateTime = 'xsd:dateTime',
    // Double values.
    double = 'xsd:double',
    // Integer values.
    int = 'xsd:int',
    // Character strings.
    string = 'xsd:string',
  }
  