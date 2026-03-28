const BASE_URL = 'https://docs.actionstep.com/downloads';

export const actionstepEndpoints = [
  'actions',
  'actionbillsettings',
  'actionfolders',
  'actionnetdocssettings',
  'actionparticipants',
  'actiontypes',
  'actiontypeparticipanttypes',
  'bills',
  'contactdocuments',
  'contactfolders',
  'contactnotes',
  'contactrelationships',
  'culturalidentity',
  'datacollections',
  'datacollectionfields',
  'datacollectionfielddropdownchoices',
  'datacollectionrecords',
  'datacollectionrecordvalues',
  'disabilitystatus',
  'disbursements',
  'filenotes',
  'gendertypes',
  'participants',
  'participantadditionalnotificationmethods',
  'participantdatafielddropdownchoices',
  'participantrelationshiptypes',
  'participantdefaulttypes',
  'participanttypedatafields',
  'phonerecords',
  'primarylanguage',
  'quickcodes',
  'resthooks',
  'timeentries',
  'tasks',
  'utbmscodes',
] as const;

export type ActionstepEndpoint = (typeof actionstepEndpoints)[number];

export type ActionstepSpecEntry = {
  endpoint: ActionstepEndpoint;
  url: string;
};

export const actionstepSpecManifest: ReadonlyArray<ActionstepSpecEntry> =
  actionstepEndpoints.map((endpoint) => ({
    endpoint,
    url: `${BASE_URL}/${endpoint}.yaml`,
  }));
