import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterCoupon'
})
export class FilterCouponPipe implements PipeTransform {

    transform(coupons: any, searchTerm: any): any {
        // check if search term is undefined
        if (searchTerm === undefined || searchTerm === '') { return coupons };
        // return updated supplies array
        return coupons.filter(function(coupon){
            return coupon.couponName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.eventName.toString().toLowerCase().includes(searchTerm.toLowerCase())
        });
    }

}