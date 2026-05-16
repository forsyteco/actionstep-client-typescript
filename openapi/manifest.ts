const BASE_URL = 'https://docs.actionstep.com/downloads';

export const actionstepRemoteEndpoints = [
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

// Actionstep currently labels these as legacy endpoint docs while they migrate
// documentation into the new endpoint resources pages.
export const actionstepLegacyEndpoints = [
  'actiondocuments',
  'files',
  'participanttypes',
] as const;

export type ActionstepEndpoint =
  | (typeof actionstepRemoteEndpoints)[number]
  | (typeof actionstepLegacyEndpoints)[number];

export type ActionstepSpecEntry = {
  endpoint: ActionstepEndpoint;
  input: string;
  source: 'remote' | 'legacy';
};

export const actionstepSpecManifest: ReadonlyArray<ActionstepSpecEntry> =
  [
    ...actionstepRemoteEndpoints.map((endpoint) => ({
      endpoint,
      input: `${BASE_URL}/${endpoint}.yaml`,
      source: 'remote' as const,
    })),
    ...actionstepLegacyEndpoints.map((endpoint) => ({
      endpoint,
      input: `./openapi/legacy/${endpoint}.yaml`,
      source: 'legacy' as const,
    })),
  ];
