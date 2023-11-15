import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterTable'
})
export class FilterPipe implements PipeTransform{
    transform(value: any, arg: any): any {
        let results = [];
        for(let result of value){
            for(let result2 of result){
                let text = String(result2);
                if (text.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
                    results.push(result);
                    break;
                }
                
            }
        }
        if(arg == ""){
            results = value;
        }
        return results;
    }
}