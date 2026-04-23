export type ResourceKind =
    | 'flashcards'
    | 'periodic'
    | 'trends'
    | 'oneshot'
    | 'crash-course'
    | 'twomin'
    | 'notes'
    | 'top50'
    | 'organic'
    | 'inorganic'
    | 'physical'
    | 'name-rxns'
    | 'wizard'
    | 'salt'
    | 'comingsoon';

export type Resource = {
    label: string;
    href: string;
    kind: ResourceKind;
    embedUrl?: string;
};

export type Day = {
    day: number;
    title: string;
    focus: string;
    tip?: string;
    checklist?: string[];
    resources: Resource[];
};

export type Phase = {
    id: string;
    label: string;
    days: string;
    goal: string;
    accent: string;
    gradient: string;
    icon: string;
    items: Day[];
};

export type ResourceGroup = 'Videos' | 'Notes' | 'Flashcards' | 'Tools' | 'Coming Soon';

export const KIND_GROUP: Record<ResourceKind, ResourceGroup> = {
    'oneshot':       'Videos',
    'crash-course':  'Videos',
    'twomin':        'Videos',
    'notes':         'Notes',
    'flashcards':    'Flashcards',
    'periodic':      'Tools',
    'trends':        'Tools',
    'physical':      'Tools',
    'organic':       'Tools',
    'inorganic':     'Tools',
    'name-rxns':     'Tools',
    'wizard':        'Tools',
    'salt':          'Tools',
    'top50':         'Tools',
    'comingsoon':    'Coming Soon',
};

export const GROUP_ORDER: ResourceGroup[] = ['Videos', 'Notes', 'Flashcards', 'Tools', 'Coming Soon'];
