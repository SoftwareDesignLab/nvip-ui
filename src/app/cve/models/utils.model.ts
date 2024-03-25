export class DatePeriod{
    fromDate:Date=new Date();
    toDate:Date=new Date();
    isTouched:boolean=false;
}

export interface Attribute{
    key:String,
    values:Array<String>;
}


export class Attributes{
    AttributeList:Attribute[]=[];
    isValid():Boolean{
        return this.AttributeList.length!=0;
    }

    push(key:string,value:string){
        var index=this.AttributeList.findIndex(c=>c.key==key)
        if(index==-1){
            this.AttributeList.push({key:key,values:[value]})
        }
        else{
            this.AttributeList[index].values.push(value)
        }   
    }
    pop(key:string,value:string){
        
        var index=this.AttributeList.findIndex(c=>c.key==key)
        if(this.AttributeList[index].values.length==1)
            this.AttributeList.splice(index,1)
        else{
            var k=this.AttributeList[index].values.indexOf(value)
            this.AttributeList[index].values.splice(k,1)
        }
       
    }
    isChecked(key:string,value:string):Boolean{
        var checked=false;
        var index=this.AttributeList.findIndex(c=>c.key==key);
        if(index!=-1){
            checked =this.AttributeList[index].values.indexOf(value)!=-1;
        }
        return checked;
    }
    toJsonString():string{
        return JSON.stringify(this.AttributeList)
    }

}

export class Search{
    cveId:string="";
    cpe:string="";
    publihedDate:DatePeriod=new DatePeriod();
    cvss:string[]=[];
    vdo:Attributes=new Attributes();
    
}