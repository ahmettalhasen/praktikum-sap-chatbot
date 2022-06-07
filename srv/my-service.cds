
//using { PP_My_Perspective as PurchaseDataView } from '../db/PP_My_Perspective';
using DwcService from './external/DwcService.csn';
 
service MyService {
    //entity PurchaseData as projection on PurchaseDataView

    @readonly entity PurchaseData as projection on DwcService.PurchasingPerspective;
}



