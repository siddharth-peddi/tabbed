export type Person = {
    id : string;
    name : string;
};

export type Item = {
    id : string;
    name : string;
    priceCents : number;
    splitAmongst : string[];
}

export type Tab = {
    name : string;
    people : Person[];
    items : Item[];
    paidBy : string;
    taxCents : number;
    tip : number;
    splitTip : boolean;
}