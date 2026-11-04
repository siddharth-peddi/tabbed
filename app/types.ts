type Person = {
    id : string;
    name : string;
};

type Item = {
    id : string;
    name : string;
    priceCents : number;
    splitAmongst : string[];
}

type Tab = {
    name : string;
    people : Person[];
    items : Item[];
    paidBy : string;
    taxCents : number;
    tip : number;
    splitTip : boolean;
}