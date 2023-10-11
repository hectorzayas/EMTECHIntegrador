import { LightningElement, track, wire, api } from 'lwc';
import { getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from "lightning/navigation";

import getOpportunitiesLWC from '@salesforce/apex/OpportunityController.getOpportunitiesLWC';

const OPPORTUNITY_COLUMNS = [
    {label: 'Opportunity Name', fieldName: 'Name', type: 'button', typeAttributes: { label: { fieldName: "Name" }, name: "gotoOpportunity", variant: "base" },  cellAttributes: { alignment: 'left' }, hideDefaultActions : true},
    {label: 'Account Name', fieldName: 'Account.Name', type: 'text', cellAttributes: { alignment: 'left' }, hideDefaultActions : true},
    {label: 'Amount', fieldName: 'Amount', type: 'currency', cellAttributes: { alignment: 'left' }, hideDefaultActions : true},
    {label: 'Close Date', fieldName: 'CloseDate', type: 'date', cellAttributes: { alignment: 'left' }, hideDefaultActions : true},
    {label: 'Stage', fieldName: 'StageName', type: 'text', cellAttributes: { alignment: 'left' }, hideDefaultActions : true},
    {label: 'Type', fieldName: 'Type', type: 'text', cellAttributes: { alignment: 'left' }, hideDefaultActions : true}
]

export default class EMTECHLWCOpportunityTable extends NavigationMixin(LightningElement) {
    opportunityColumns = OPPORTUNITY_COLUMNS;
    
    @api recordId;

    @track opportunitiesData;

    // Flat Information
    // https://developer.salesforce.com/forums/?id=9062I000000DI5rQAG
    // https://www.srinivas4sfdc.com/2019/11/how-to-access-parent-object-or.html
    @wire (getOpportunitiesLWC, {recordId: "$recordId"})
    wiredActivities({ error, data }) {
        if(data){
            this.opportunitiesData =  data.map(
                record => Object.assign(
                    { "Account.Name": record.Account.Name},
                    record
                )
            );
        }
    else if(error){
        this.error = error;
        this.opportunitiesData = undefined;
    }  
  }

  // Row HYPERLINK
  // https://www.forcetrails.com/2020/07/open-standard-record-editview-page-from.html
    handleRowAction(event) {
        if (event.detail.action.name === "gotoOpportunity") {
            this[NavigationMixin.GenerateUrl]({
                type: "standard__recordPage",
                attributes: {
                    recordId: event.detail.row.Id,
                    actionName: "view"
                }
            }).then((url) => {
                window.open(url, "_blank");
            });
        }
    }
}
