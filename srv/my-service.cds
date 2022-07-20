using DwcService from './external/DwcService.csn';
 
service MyService {

    entity PurchaseData as projection on DwcService.PurchasingPerspective {
        maktx, bsart, maktl, ebeln, land1, matnr, bstyp, ebelp,
        ekorg, bukrs, name1, lifnr,meins, mtart, aedat, ekgrp, brtwr,
        menge, netwr
    } group by maktx;

    entity PurchaseDataGroupByX as projection on DwcService.PurchasingPerspective {
        bsart,
        } group by bsart;

    function sum() returns String(255);

    function helloWorld() returns String;

    function aggregate() returns String;

    function selectgroup() returns String;

    function getData() returns String;
    function getData2() returns String;

}
