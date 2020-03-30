import * as jsonSchema from "json-schema";
import { IOperatorsState } from "reducers/operators";
import { IAuthState } from "../reducers/auth";
import { IServiceCatalogState } from "../reducers/catalog";
import { IConfigState } from "../reducers/config";
import { INamespaceState } from "../reducers/namespace";
import { IAppRepositoryState } from "../reducers/repos";
import { hapi } from "./hapi/release";
import { ResourceKind } from "./ResourceKinds";

// Allow defining multiple error classes
// tslint:disable:max-classes-per-file

class CustomError extends Error {
  // The constructor is defined so we can later on compare the returned object
  // via err.contructor  == FOO
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class ForbiddenError extends CustomError {}
export class UnauthorizedError extends CustomError {}

export class NotFoundError extends CustomError {}

export class ConflictError extends CustomError {}

export class UnprocessableEntity extends CustomError {}

export class InternalServerError extends CustomError {}

export interface IRepo {
  namespace: string;
  name: string;
  url: string;
}

export interface IChartVersion {
  id: string;
  attributes: IChartVersionAttributes;
  relationships: {
    chart: {
      data: IChartAttributes;
    };
  };
}

export interface IChartVersionAttributes {
  version: string;
  app_version: string;
  created: string;
}

export interface IChart {
  id: string;
  attributes: IChartAttributes;
  relationships: {
    latestChartVersion: {
      data: IChartVersionAttributes;
    };
  };
}

export interface IChartAttributes {
  name: string;
  description: string;
  home?: string;
  icon?: string;
  keywords: string[];
  maintainers: Array<{
    name: string;
    email?: string;
  }>;
  repo: IRepo;
  sources: string[];
}

export interface IChartState {
  isFetching: boolean;
  selected: {
    error?: Error;
    version?: IChartVersion;
    versions: IChartVersion[];
    readme?: string;
    readmeError?: string;
    values?: string;
    schema?: any;
  };
  deployed: {
    chartVersion?: IChartVersion;
    values?: string;
    schema?: jsonSchema.JSONSchema4;
  };
  items: IChart[];
}

export interface IChartUpdateInfo {
  upToDate: boolean;
  chartLatestVersion: string;
  appLatestVersion: string;
  repository: IRepo;
  error?: Error;
}

export interface IDeployment {
  metadata: {
    name: string;
    namespace: string;
  };
}

export interface IServiceSpec {
  ports: IPort[];
  clusterIP: string;
  type: string;
}

export interface IServiceStatus {
  loadBalancer: {
    ingress?: Array<{ ip?: string; hostname?: string }>;
  };
}

export interface IPort {
  name: string;
  port: number;
  protocol: string;
  targetPort: string;
  nodePort: string;
}

export interface IHTTPIngressPath {
  path: string;
}
export interface IIngressHTTP {
  paths: IHTTPIngressPath[];
}
export interface IIngressRule {
  host: string;
  http: IIngressHTTP;
}

export interface IIngressTLS {
  hosts: string[];
}

export interface IIngressSpec {
  rules: IIngressRule[];
  tls?: IIngressTLS[];
  backend?: {
    serviceName: string;
    servicePort: number;
  };
}

export interface IResource {
  apiVersion: string;
  kind: ResourceKind;
  type: string;
  spec: any;
  status: any;
  metadata: {
    name: string;
    namespace: string;
    annotations: { [key: string]: string };
    creationTimestamp: string;
    selfLink: string;
    resourceVersion: string;
    deletionTimestamp?: string;
    uid: string;
  };
}

export interface IOwnerReference {
  apiVersion: string;
  blockOwnerDeletion: boolean;
  kind: string;
  name: string;
  uid: string;
}

export interface ISecret {
  apiVersion: string;
  kind: string;
  type: string;
  data: { [s: string]: string };
  metadata: {
    name: string;
    namespace: string;
    annotations: string;
    creationTimestamp: string;
    selfLink: string;
    resourceVersion: string;
    deletionTimestamp?: string;
    uid: string;
  };
}

export interface IDeploymentStatus {
  replicas: number;
  updatedReplicas: number;
  availableReplicas: number;
}

export interface IStatefulsetStatus {
  replicas: number;
  updatedReplicas: number;
  readyReplicas: number;
}

export interface IDaemonsetStatus {
  currentNumberScheduled: number;
  numberReady: number;
}

export interface IRelease extends hapi.release.Release {
  updateInfo?: IChartUpdateInfo;
}

export interface IPackageManifestStatus {
  catalogSource: string;
  catalogSourceDisplayName: string;
  catalogSourceNamespace: string;
  catalogSourcePublisher: string;
  provider: {
    name: string;
  };
  defaultChannel: string;
  channels: Array<{
    name: string;
    currentCSV: string;
    currentCSVDesc: {
      annotations: {
        "alm-examples": string;
        capabilities: string;
        categories: string;
        certified: string;
        containerImage: string;
        createdAt: string;
        description: string;
        repository: string;
        support: string;
      };
      description: string;
      displayName: string;
      provider: {
        name: string;
      };
      version: string;
      installModes: [
        { supported: boolean; type: "OwnNamespace" },
        { supported: boolean; type: "SingleNamespace" },
        { supported: boolean; type: "MultiNamespace" },
        { supported: boolean; type: "AllNamespaces" },
      ];
      customresourcedefinitions: {
        owned: Array<{
          description: string;
          displayName: string;
          kind: string;
          name: string;
          version: string;
        }>;
      };
    };
  }>;
}

export interface IPackageManifest extends IResource {
  status: IPackageManifestStatus;
}

export interface IClusterServiceVersionCRDResource {
  kind: string;
  name: string;
  version: string;
}

export interface IClusterServiceVersionCRD {
  description: string;
  displayName: string;
  kind: string;
  name: string;
  version: string;
  resources: IClusterServiceVersionCRDResource[];
  specDescriptors: Array<{
    description: string;
    displayName: string;
    path: string;
    "x-descriptors": string[];
  }>;
  statusDescriptors: Array<{
    description: string;
    displayName: string;
    path: string;
    "x-descriptors": string[];
  }>;
}

export interface IClusterServiceVersionSpec {
  apiservicedefinitions: any;
  customresourcedefinitions: {
    owned: IClusterServiceVersionCRD[];
  };
  description: string;
  displayName: string;
  icon: Array<{
    base64data: string;
    mediatype: string;
  }>;
  install: any;
  installModes: [
    { supported: boolean; type: "OwnNamespace" },
    { supported: boolean; type: "SingleNamespace" },
    { supported: boolean; type: "MultiNamespace" },
    { supported: boolean; type: "AllNamespaces" },
  ];
  keywords: string[];
  labels: any;
  links: Array<{
    name: string;
    url: string;
  }>;
  maintainers: Array<{
    email: string;
    name: string;
  }>;
  maturity: string;
  provider: {
    name: string;
  };
  selector: any;
  version: string;
}

export interface IClusterServiceVersion extends IResource {
  spec: IClusterServiceVersionSpec;
}

export interface IAppState {
  isFetching: boolean;
  error?: Error;
  deleteError?: Error;
  // currently items are always Helm releases
  items: IRelease[];
  listingAll: boolean;
  listOverview?: IAppOverview[];
  selected?: IRelease;
}

export interface IStoreState {
  catalog: IServiceCatalogState;
  apps: IAppState;
  auth: IAuthState;
  charts: IChartState;
  config: IConfigState;
  kube: IKubeState;
  repos: IAppRepositoryState;
  namespace: INamespaceState;
  operators: IOperatorsState;
}

interface IK8sResource {
  apiVersion: string;
  kind: string;
}

/** @see https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md#objects */
export interface IK8sObject<M, SP, ST> extends IK8sResource {
  metadata: {
    annotations?: { [key: string]: string };
    creationTimestamp?: string;
    deletionTimestamp?: string | null;
    generation?: number;
    labels?: { [key: string]: string };
    name: string;
    namespace: string;
    resourceVersion?: string;
    uid: string;
    selfLink?: string; // Not in docs, but seems to exist everywhere
  } & M;
  spec?: SP;
  status?: ST;
}

/** @see https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md#lists-and-simple-kinds */
export interface IK8sList<I, M> extends IK8sResource {
  items: I[];
  metadata?: {
    resourceVersion?: string;
    selfLink?: string; // Not in docs, but seems to exist everywhere
  } & M;
}

export interface IAppRepository
  extends IK8sObject<
    {
      clusterName: string;
      creationTimestamp: string;
      deletionGracePeriodSeconds: string | null;
      deletionTimestamp: string | null;
      resourceVersion: string;
      selfLink: string;
    },
    {
      type: string;
      url: string;
      auth: {
        header: {
          secretKeyRef: {
            name: string;
            key: string;
          };
        };
      };
      resyncRequests: number;
    },
    undefined
  > {}

export interface ICreateAppRepositoryResponse {
  appRepository: IAppRepository;
}

export interface IAppRepositoryList
  extends IK8sList<
    IAppRepository,
    {
      continue: string;
      resourceVersion: string;
      selfLink: string;
    }
  > {}

export interface IAppRepositoryKey {
  name: string;
  namespace: string;
}

/** @see https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md#response-status-kind */
export interface IStatus extends IK8sResource {
  kind: "Status";
  status: "Success" | "Failure";
  message: string;
  reason:
    | "BadRequest"
    | "Unauthorized"
    | "Forbidden"
    | "NotFound"
    | "AlreadyExists"
    | "Conflict"
    | "Invalid"
    | "Timeout"
    | "ServerTimeout"
    | "MethodNotAllowed"
    | "InternalError";
  details?: {
    kind?: string;
    name?: string;
    causes?: IStatusCause[] | string;
  };
}

interface IStatusCause {
  field: string;
  message: string;
  reason: string;
}

export interface IRouterPathname {
  router: {
    location: {
      pathname: string;
    };
  };
}

export interface IRuntimeVersion {
  name: string;
  version: string;
  runtimeImage: string;
  initImage: string;
}

export interface IRuntime {
  ID: string;
  versions: IRuntimeVersion[];
  depName: string;
  fileNameSuffix: string;
}

export interface IRBACRole {
  apiGroup: string;
  namespace?: string;
  clusterWide?: boolean;
  resource: string;
  verbs: string[];
}

export interface IAppOverview {
  releaseName: string;
  namespace: string;
  version: string;
  icon?: string;
  status: string;
  chart: string;
  chartMetadata: hapi.chart.Metadata;
  // UpdateInfo is internally populated
  updateInfo?: IChartUpdateInfo;
}

export interface IKubeItem<T> {
  isFetching: boolean;
  item?: T;
  error?: Error;
}

export interface IKubeState {
  items: { [s: string]: IKubeItem<IResource | IK8sList<IResource, {}>> };
  sockets: { [s: string]: { socket: WebSocket; closeTimer: () => void } };
}

export interface IBasicFormParam {
  path: string;
  type?: jsonSchema.JSONSchema4TypeName | jsonSchema.JSONSchema4TypeName[];
  value?: any;
  title?: string;
  minimum?: number;
  maximum?: number;
  render?: string;
  description?: string;
  hidden?:
    | {
        condition: any;
        value: string;
      }
    | string;
  children?: IBasicFormParam[];
}
export interface IBasicFormSliderParam extends IBasicFormParam {
  sliderMin?: number;
  sliderMax?: number;
  sliderUnit?: string;
}
