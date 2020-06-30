import unittest
import json

from app import app

class BasicTestCase(unittest.TestCase):

    def test_index(self):
        tester = app.test_client(self)
        response = tester.get('/', content_type='html/text')
        self.assertEqual(response.status_code, 200)
        #self.assertEqual(response.data, b'Hello, World!')

    # def test_date(self):
    #     tester = app.test_client(self)
    #     response = tester.get('/date/01-22')
    #     data = json.loads(response.data)
    #     self.assertEqual(data['count'], 1)
    #     self.assertEqual(data['gender'], 'F')
    #     #self.assertEqual(data['place'], 'Kaohsiung')
    #     self.assertEqual(data['out'], 'Y')

    def test_TWData(self):
        tester = app.test_client(self)
        response = tester.get('/TWData')
        data = json.loads(response.data)
        self.assertNotEqual(data['diagnoseNum'], -1)
        self.assertNotEqual(data['releaseNum'], -1)
        self.assertNotEqual(data['deadNum'], -1)
        self.assertNotEqual(data['inspectNum'], -1)
        self.assertNotEqual(data['excludeNum'], -1)
        self.assertNotEqual(data['ysdDiagnoseNum'], -1)
        self.assertNotEqual(data['ysdInspectionNum'], -1)
        self.assertNotEqual(data['ysdExcludeNum'], -1)
        self.assertTrue(isinstance(data['inspectNum'], str))
        self.assertTrue(isinstance(data['excludeNum'], str))



if __name__ == '__main__':
    unittest.main()