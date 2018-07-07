import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEvent'
})
export class FilterEventPipe implements PipeTransform {

  transform(events: any, searchTerm: any): any {
    // check if search term is undefined
    if (searchTerm === undefined || searchTerm === '') { return events };

    // return updated supplies array
    return events.filter(function(event){
        return event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.whatsappNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.email.toLowerCase().includes(searchTerm.toLowerCase())
    });

  }

}
