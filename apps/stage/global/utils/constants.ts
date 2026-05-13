/*
 *
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *   If not, see <http://www.gnu.org/licenses/>.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 *  SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 *  OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 *  IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import urlJoin from 'url-join';

import { getConfig } from '../config';

const { NEXT_PUBLIC_KEYCLOAK_HOST, NEXT_PUBLIC_KEYCLOAK_REALM } = getConfig();

export const EXPLORER_PATH = '/explorer';
export const USER_PATH = '/user';
export const LOGIN_PATH = '/login';

export const ROOT_PATH = '/';

export enum INTERNAL_PATHS {
	MOLECULAR = '/molecular',
	DATATABLE_1 = '/dataTableOne',
	DATATABLE_2 = '/dataTableTwo',
	DATATABLE_3 = '/dataTableThree',
	DATATABLE_4 = '/dataTableFour',
	DATATABLE_5 = '/dataTableFive',
	HOME = '/home',
	DOCUMENTATION = '/documentation',
	ELASTICVUE = '/documentation/elasticvue',
	SONG = '/swaggerDocs/song',
	LYRIC = '/swaggerDocs/lyric',
	LECTERN = '/swaggerDocs/lectern',
	SCORE = '/swaggerDocs/score',
	DICTIONARY = '/dictionary',
	ALS_OVERVIEW = '/als-overview',
	EGA_EXPLORER = '/ega-explorer',
	DISEASE_MODEL = '/disease-model',
	DATA_SOURCES = '/data-sources',
	ABOUT = '/about',
}

// external Swagger links
export const LECTERN_SWAGGER = 'http://localhost:3031/api-docs';
export const LYRIC_SWAGGER = 'http://localhost:3030/api-docs';
export const SONG_SWAGGER = 'http://localhost:8080/swagger-ui.html';
export const SCORE_SWAGGER = 'http://localhost:8087/swagger-ui.html';

// graphql api
export const ARRANGER_GQL = 'http://localhost:5050/graphql/apollo';

// external docs links
export const ELASTICVUE_DOCS =
	'https://docs.overture.bio/guides/administration-guides/customizing-the-data-portal/#viewing-elasticsearch-documents';
export const HELP_URL = 'https://github.com/overture-stack/docs/discussions/new?category=support';
export const EMAIL_SETTING_URL = 'admin@example.com';
export const DOCS_URL = 'https://docs.overture.bio';

// keycloak
export const KEYCLOAK_URL_ISSUER = urlJoin(NEXT_PUBLIC_KEYCLOAK_HOST, 'realms', NEXT_PUBLIC_KEYCLOAK_REALM);
export const KEYCLOAK_URL_TOKEN = urlJoin(KEYCLOAK_URL_ISSUER, 'protocol/openid-connect/token');
export const KEYCLOAK_API_KEY_ENDPOINT = urlJoin(KEYCLOAK_URL_ISSUER, 'apikey/api_key');

export const AUTH_PROVIDER = {
	KEYCLOAK: 'keycloak',
};

const PROXY_API_PATH = '/api';
const PROXY_PROTECTED_API_PATH = '/api/protected';

export const INTERNAL_API_PROXY = {
	DATATABLE_1_ARRANGER: urlJoin(PROXY_API_PATH, 'dataset_1_arranger'),
	DATATABLE_2_ARRANGER: urlJoin(PROXY_API_PATH, 'dataset_2_arranger'),
	DATATABLE_3_ARRANGER: urlJoin(PROXY_API_PATH, 'dataset_3_arranger'),
	DATATABLE_4_ARRANGER: urlJoin(PROXY_API_PATH, 'dataset_4_arranger'),
	DATATABLE_5_ARRANGER: urlJoin(PROXY_API_PATH, 'dataset_5_arranger'),
	MOLECULAR_ARRANGER: urlJoin(PROXY_API_PATH, 'molecular_arranger'),
	PROTECTED_ARRANGER: urlJoin(PROXY_PROTECTED_API_PATH, 'arranger'),
	PROTECTED_KEYCLOAK_APIKEY_ENDPOINT: urlJoin(PROXY_PROTECTED_API_PATH, 'keycloak/apikey'),
	PROTECTED_KEYCLOAK_TOKEN_ENDPOINT: urlJoin(PROXY_PROTECTED_API_PATH, 'keycloak/token'),
	SONG: urlJoin(PROXY_API_PATH, 'song'),
} as const;

// Monarch Initiative API
export const MONARCH_API_BASE_URL = 'https://api-v3.monarchinitiative.org/v3/api';
export const ALS_MONDO_ID = 'MONDO:0004976';

// EGA Metadata API
export const EGA_API_BASE_URL = 'https://metadata.ega-archive.org';
export const ALS_EGA_KEYWORDS = ['als', 'amyotrophic', 'motor neuron disease'];

// Predefined list of ALS-related study accession IDs from EGA.
// Maintained automatically by the GitHub Actions workflow (.github/workflows/update-ega-als-ids.yml).
export const ALS_EGA_ACCESSION_IDS: string[] = [
	'EGAS00001002439',
	'EGAS00001002462',
	'EGAS00001002473',
	'EGAS00001002598',
	'EGAS00001003295',
	'EGAS00001003383',
	'EGAS00001004286',
	'EGAS00001004587',
	'EGAS00001005220',
	'EGAS00001005879',
	'EGAS00001005880',
	'EGAS00001005881',
	'EGAS00001006138',
	'EGAS00001006675',
	'EGAS00001006711',
	'EGAS00001007318',
	'EGAS00001008053',
	'EGAS50000000575',
	'EGAS50000000908',
	'EGAS50000000909',
	'EGAS50000001019',
	'EGAS50000001267',
	'EGAS50000001562',
	'EGAS50000001563',
	'EGAS50000001566',
];

export enum ALS_ASSOCIATION_CATEGORIES {
	CAUSAL_GENE_TO_DISEASE = 'biolink:CausalGeneToDiseaseAssociation',
	CORRELATED_GENE_TO_DISEASE = 'biolink:CorrelatedGeneToDiseaseAssociation',
	DISEASE_TO_PHENOTYPE = 'biolink:DiseaseToPhenotypicFeatureAssociation',
	GENE_TO_PHENOTYPE = 'biolink:GeneToPhenotypicFeatureAssociation',
	GENOTYPE_TO_DISEASE = 'biolink:GenotypeToDiseaseAssociation',
	DISEASE_TO_GENETIC_INHERITANCE = 'biolink:DiseaseOrPhenotypicFeatureToGeneticInheritanceAssociation',
}
