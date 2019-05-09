import { Component, OnChanges, Input } from '@angular/core';
import * as Eos from 'eosjs';
import { environment } from '../../../environments/environment';
import { Observable, from, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-vote-progress-bar',
  templateUrl: './vote-progress-bar.component.html',
  styleUrls: ['./vote-progress-bar.component.scss']
})
export class VoteProgressBarComponent implements OnChanges {

  @Input() chainStatus;
  chainPercentage;
  chainNumber;
  private apiEndpointSource = new BehaviorSubject<string>(environment.blockchainUrl);

  public apiEndpoint$ = this.apiEndpointSource.asObservable();
  public eos: any;
  public supply: any;

  constructor() {
    this.apiEndpoint$.subscribe(apiEndpoint => {
      this.eos = Eos({
        httpEndpoint: apiEndpoint,
        blockId: environment.chainId
      });
    });
   }

  ngOnChanges() {
    const allBeosTokens$: Observable<any[]> = from(this.eos.getCurrencyStats('eosio.token', 'BEOS'));
    allBeosTokens$.subscribe(
      (data) => {
        if (data['BEOS']) {
          this.supply = data['BEOS'].supply.split(' ')[0];
        }
      }
    );
    if (this.chainStatus && this.supply) {
      this.chainPercentage = (this.chainStatus.total_activated_stake / 10000 / this.supply * 100).toFixed(2);
      this.chainNumber = this.supply;
    }
  }

}
