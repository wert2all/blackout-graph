import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  runTransaction,
} from '@angular/fire/firestore';
import { DateTime } from 'luxon';
import { from, map, Observable } from 'rxjs';

import { hourToString } from '../app.types';
import { dateStringFromTime } from '../share/lib.functions';
import { LightEntity } from '../store/light/light.types';

@Injectable({
  providedIn: 'root',
})
export class LightService {
  private readonly collectionName = 'light';
  private readonly firestore = inject(Firestore);

  getLights(now: DateTime<true>): Observable<Record<string, LightEntity>> {
    return from(getDoc(doc(this.getCollection(), this.getKey(now)))).pipe(
      map((snap) => (snap.exists() ? snap.data() : {})),
    );
  }

  add(status: string, time: DateTime): Observable<LightEntity> {
    const lightsRef = this.getCollection();
    const docRef = doc(lightsRef, this.getKey(time));
    const validTime = time.toISO() as string;

    return from(
      runTransaction(this.firestore, async (transaction) => {
        const sfDoc = await transaction.get(docRef);
        const newDoc = { status: status, time: validTime };
        if (!sfDoc.exists()) {
          transaction.set(docRef, {
            [hourToString(time.hour)]: newDoc,
          });
        } else {
          const data = { ...sfDoc.data() };
          data[hourToString(time.hour)] = newDoc;
          transaction.update(docRef, data);
        }
        return newDoc;
      }),
    );
  }
  private getCollection() {
    return collection(this.firestore, this.collectionName);
  }
  private getKey(time: DateTime<boolean>): string {
    return dateStringFromTime(time);
  }
}
