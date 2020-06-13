import { BaseEntity } from 'typeorm';
export declare enum SessionPhase {
    CREATION = 0,
    AGGREGATION = 1
}
export declare class Session extends BaseEntity {
    id: string;
    addLink: string;
    expirationTimestamp: number;
    phase: SessionPhase;
}
