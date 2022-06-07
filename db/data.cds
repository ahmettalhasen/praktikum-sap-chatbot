using { cuid } from '@sap/cds/common';

namespace db;

entity Purchase : cuid {
    key ID: Integer; 
    name: String(255);
    grossOrderValue: Integer;
    menge: Integer;

}