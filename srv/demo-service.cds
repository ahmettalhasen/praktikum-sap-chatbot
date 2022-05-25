using { db as my } from '../db/schema';

service MyService {

    entity Foo as projection on my.Foo;

}

