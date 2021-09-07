import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterTable'
})
export class FilterPipe implements PipeTransform{
    transform(value: any, arg: any): any {
        let results = [];
        //console.log('arg:' ,arg); 
        //console.log('value:' ,value); 
        /*value.forEach(element => {
            console.log(element);
            element.forEach(element2 => {
                let text = String(element2);
                if (text.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
                    results.push(element);
                }
            });
        });*/
        //console.log("FOR");
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
        //console.log("RESULT PIPE");
        //console.log(results);
        return results;
    }
}