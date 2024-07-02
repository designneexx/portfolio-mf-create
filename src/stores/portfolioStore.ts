import { makeAutoObservable } from 'mobx';
import { PortfolioStructureResponse } from 'src/api/portfolio/types';

export class PortfolioStore {
    isCreated: boolean = false;
    isLoading: boolean = false;
    portfolio: null | PortfolioStructureResponse = null;

    setIsCreated = (value: boolean) => {
        this.isCreated = value;
    };

    setIsLoading = (value: boolean) => {
        this.isLoading = value;
    };

    setPortfolio = (value: null | PortfolioStructureResponse) => {
        this.portfolio = value;
    };

    constructor() {
        makeAutoObservable(this);
    }
}
