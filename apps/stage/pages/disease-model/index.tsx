import DiseaseModel from '@/components/pages/diseaseModel';
import { createPage } from '../../global/utils/pages';

const DiseaseModelPage = createPage({
	isPublic: true,
})(() => <DiseaseModel />);

export default DiseaseModelPage;
