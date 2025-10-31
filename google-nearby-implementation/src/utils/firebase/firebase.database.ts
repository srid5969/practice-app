import {
	initializeApp,
	applicationDefault,
	cert,
	ServiceAccount,
} from 'firebase-admin/app';
import {
	getFirestore,
	Timestamp,
	FieldValue,
	Filter,
} from 'firebase-admin/firestore';
import { env } from '../../environment';

// Firebase configuration
const serviceAccount: ServiceAccount = {
	clientEmail: env.firebaseClientEmail,
	privateKey: env.firebasePrivateKey,
	projectId: env.firebaseProjectId,
};

// Initialize Firebase
const app = initializeApp({
	credential: cert(serviceAccount),
});

const database = getFirestore(app);

// Database utility functions

export { database };

export class PlacesFirebaseDatabase {
	static async writePlace(placeId: string, data: any) {
		return database.collection('places').doc(placeId).set(data);
	}
	static async readPlace(placeId: string): Promise<any> {
		const doc = await database.collection('places').doc(placeId).get();
		return doc.exists ? doc.data() : null;
	}
	static async deletePlace(placeId: string) {
		return database.collection('places').doc(placeId).delete();
	}
	static listenToPlace(
		placeId: string,
		callback: (data: any) => void,
	): () => void {
		return database
			.collection('places')
			.doc(placeId)
			.onSnapshot((doc) => {
				const data = doc.exists ? doc.data() : null;
				callback(data);
			});
	}
	// list all places
	static async listAllPlaces(): Promise<any> {
		const snapshot = await database.collection('places').get();
		return snapshot.docs.map((doc) => doc.data());
	}
}
