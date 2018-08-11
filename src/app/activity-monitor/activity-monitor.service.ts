import { getActivities } from '../bungie-api/destiny2-api';
import { DestinyAccount } from '../accounts/destiny-account.service';
import { getDefinitions } from '../destiny2/d2-definitions.service';
import {
  DestinyCharacterActivitiesComponent,
  DestinyActivityDefinition,
  DestinyActivityModeDefinition,
  DestinyDestinationDefinition,
  DestinyActivityTypeDefinition,
  DestinyPlaceDefinition
} from 'bungie-api-ts/destiny2';

export interface ActivityResult {
  characterId: string;
  data: DestinyCharacterActivitiesComponent;
  activity: DestinyActivityDefinition;
  activityMode: DestinyActivityModeDefinition;
  destination: DestinyDestinationDefinition;
  activityType: DestinyActivityTypeDefinition;
  place: DestinyPlaceDefinition;
}

export function getActivities$(account: DestinyAccount) {
  return loadActivities(account);
}

async function loadActivities(account): Promise<ActivityResult | undefined> {
  const activities = await getActivities(account);
  const definitions = await getDefinitions();
  const characterIds = Object.keys(activities.characterActivities.data);
  const characterId = characterIds.find((id) =>
    activities.characterActivities.data[id].currentActivityHash !== 0
  );

  if (characterId) {
    const data = activities.characterActivities.data[characterId];
    const activity = definitions.Activity.get(data.currentActivityHash);
    const activityMode = definitions.ActivityMode[data.currentActivityModeHash];
    const destination = definitions.Destination.get(activity.destinationHash);
    const activityType = definitions.ActivityType.get(activity.activityTypeHash);
    const place = definitions.Place.get(activity.placeHash);

    return ({
      characterId,
      data,
      activity,
      activityMode,
      destination,
      activityType,
      place
    });
  } else {
    return undefined;
  }
}
