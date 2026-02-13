import DataSources from '@/components/pages/dataSources';
import { createPage } from '../../global/utils/pages';

const DataSourcesPage = createPage({
	isPublic: true,
})(() => <DataSources />);

export default DataSourcesPage;
