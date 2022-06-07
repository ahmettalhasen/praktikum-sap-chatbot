using { db as my } from '../db/schema';

service MyService2 {

    entity Foo as projection on my.Foo;

}

