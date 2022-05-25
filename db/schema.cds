using { cuid } from '@sap/cds/common';

namespace db;

entity Foo : cuid {
name: String(255);
}
