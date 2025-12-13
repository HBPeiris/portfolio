export interface NavLink{
    label:string;
    to:string;
    isExternal?:boolean;
}
export interface NavBarProps{
    links:NavLink[];
}