export interface Mission {
	missionRank: string;
	missionCreator: string;
	missionDescription: string;
	missionLeader: string;
	missionMember: string[];
	missionHoP: number;
	createdAt: string;
	finish: boolean;
}

export interface Level {
	xp: number;
}
