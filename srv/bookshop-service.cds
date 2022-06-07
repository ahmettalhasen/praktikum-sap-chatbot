using { my.bookshop as my } from '../db/data-model';

service BookshopService {

/*
     entity Books as projection on my.Books;
  entity Authors as projection on my.Authors;
  action submitOrder (book : Books:ID, quantity : Integer);
  */

  entity Books {
    key ID : UUID;
    /*title  : String;*/
    /*author : Association to Authors*/
  }

/*
    actions {
  function getData() returns Integer;
    }
    */
/*
  entity Authors {
    key ID : UUID;
    name   : String;
    books  : Association to many Books on books.author = $self;
  }
  */

  action submitOrder (book : Books:ID, quantity : Integer);

}