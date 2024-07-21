import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs, query } from '@angular/fire/firestore';
import { from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LightService {
  private readonly firestore = inject(Firestore);

  getLights() {
    return from(getDocs(query(collection(this.firestore, 'light')))).pipe(
      map((result) => result.docs.map((doc) => doc.data())),
    );
  }
}
