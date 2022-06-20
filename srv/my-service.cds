
//using { PP_My_Perspective as PurchaseDataView } from '../db/PP_My_Perspective';
using DwcService from './external/DwcService.csn';
 
service MyService {
    //entity PurchaseData as projection on PurchaseDataView

    entity PurchaseData as projection on DwcService.PurchasingPerspective {
        maktx, bsart, maktl, ebeln, land1, matnr, bstyp, ebelp,
        ekorg, bukrs, name1, lifnr,meins, mtart, aedat, ekgrp, brtwr,
        menge, netwr, sum(menge) as value: Integer
    } group by maktx;

    entity PurchaseDataGroupByX as projection on DwcService.PurchasingPerspective {
        bsart,
        } group by bsart;

    function sum() returns String(255);

    function helloWorld() returns String;

    function aggregate() returns String;
}



