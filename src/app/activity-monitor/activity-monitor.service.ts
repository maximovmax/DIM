import { getActivities } from '../bungie-api/destiny2-api';
import { DestinyAccount } from '../accounts/destiny-account.service';
import { getDefinitions } from '../destiny2/d2-definitions.service';

export function getActivities$(account: DestinyAccount) {
  return loadActivities(account);
}

async function loadActivities(account) {
  const activities = await getActivities(account);
  const definitions = await getDefinitions();

  const characterIds = Object.keys(activities.characterActivities.data);

  const currentCharacterId = characterIds.find((id) => activities.characterActivities.data[id].currentActivityHash !== 0);

  if (currentCharacterId) {
    const currentCharacterData = activities.characterActivities.data[currentCharacterId];
    const activity = definitions.Activity.get(currentCharacterData.currentActivityHash);

    const current = {
      characterId: currentCharacterId,
      data: currentCharacterData,
      activity,
      activityMode: definitions.ActivityMode[currentCharacterData.currentActivityModeHash],
      destination: definitions.Destination.get(activity.destinationHash),
      activityType: definitions.ActivityType.get(activity.activityTypeHash),
      place: definitions.Place.get(activity.placeHash)
    };

    console.log(definitions.ActivityMode);

    return (current);
  } else {
    return undefined;
  }
}
