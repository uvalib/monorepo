import { parseJSON } from 'date-fns';
import { GeneralSearchResult } from './GeneralSearchResult.js';

/* eslint-disable camelcase */
export class SpaceBooking extends GeneralSearchResult {
  // Existing properties...
  public readonly bookId?: string;
  public readonly spaceId?: number;
  public readonly categoryId?: number;
  public readonly locationId?: number;
  public readonly fromDate?: number;
  public readonly toDate?: number;
  public readonly created?: number;
  public readonly firstName?: string;
  public readonly lastName?: string;
  public readonly email?: string;
  public readonly account?: string;
  public readonly status?: string;
  public readonly locationName?: string;
  public readonly categoryName?: string;
  public readonly itemName?: string;
  public readonly event?: { id: number; title: string } | null;
  public readonly nickname?: string;
  public readonly checkInCode?: string;
  public readonly checkInStatus?: string;
  public readonly formAnswers?: { [key: string]: any };

  constructor(init?: Partial<SpaceBooking>) {
    super(init);
  }
}

export function parseSpaceBooking(space: any): SpaceBooking {
  // Extract known properties
  const {
    bookId,
    id,
    eid,
    cid,
    lid,
    fromDate,
    toDate,
    created,
    firstName,
    lastName,
    email,
    account,
    status,
    location_name,
    category_name,
    item_name,
    event,
    nickname,
    check_in_code,
    check_in_status,
    ...formAnswers
  } = space;

  return new SpaceBooking({
    id: id,
    title: item_name,
    description: undefined,
    link: undefined,
    bookId: bookId,
    spaceId: eid,
    categoryId: cid,
    locationId: lid,
    fromDate: fromDate ? parseJSON(fromDate).getTime() : undefined,
    toDate: toDate ? parseJSON(toDate).getTime() : undefined,
    created: created ? parseJSON(created).getTime() : undefined,
    firstName,
    lastName,
    email,
    account,
    status,
    locationName: location_name,
    categoryName: category_name,
    itemName: item_name,
    event,
    nickname,
    checkInCode: check_in_code,
    checkInStatus: check_in_status,
    formAnswers, // Contains custom form answers like q43, q44, etc.
  });
}

export class SpaceLocation extends GeneralSearchResult {
  public readonly locationId: number;
  public readonly name: string;
  public readonly isPublic: boolean;
  public readonly formId?: number;
  public readonly adminOnly: boolean;
  public readonly description?: string;
  public readonly terms?: string;

  constructor(init?: Partial<SpaceLocation>) {
    super(init);
    this.locationId = init?.locationId ?? 0;
    this.name = init?.name ?? '';
    this.isPublic = init?.isPublic ?? false;
    this.formId = init?.formId;
    this.adminOnly = init?.adminOnly ?? false;
    this.description = init?.description;
    this.terms = init?.terms;
  }
}

export function parseSpaceLocation(location: any): SpaceLocation {
  return new SpaceLocation({
    id: location.lid,
    title: location.name,
    description: location.description || undefined,
    link: undefined,
    locationId: location.lid,
    name: location.name,
    isPublic: location.public === 1,
    formId: location.formid,
    adminOnly: location.admin_only === 1,
    terms: location.terms || undefined,
  });
}
