import type { IOperation, IOperand, IQueryFilter, IQuery } from './IQuery';
export interface IConcept {
    $class: string;
}
export type ConceptUnion = IOperation | IOperand | IQueryFilter | IQuery;
export interface IAsset extends IConcept {
    $identifier: string;
}
export interface IParticipant extends IConcept {
    $identifier: string;
}
export interface ITransaction extends IConcept {
    $timestamp: Date;
}
export interface IEvent extends IConcept {
    $timestamp: Date;
}
