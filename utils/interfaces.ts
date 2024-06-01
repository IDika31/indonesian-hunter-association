export interface Mission {
	[date: string]: {
		[id: string]: {
			missionRank: string;
			missionCreator: string;
			missionDescription: string;
			missionLeader: string;
			missionMember: string[];
			missionHoP: number;
			createdAt: string;
			finish: boolean;
		};
	};
}

export interface Level {
	[id: string]: {
		xp: number;
	};
}
