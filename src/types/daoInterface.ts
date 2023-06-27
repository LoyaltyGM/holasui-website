export interface IDao {
  id: string;
  name: string;
  description: string;
  treasury: number;
  image: string;
  quorum: number;
  voting_delay: number;
  voting_period: number;
  subdaos: any;
  proposals: any;
}
