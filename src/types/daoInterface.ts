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

export interface IProposal {
  id: string;
  name: string;
  description: string;
  type: number;
  recipient: any;
  amount: any;
  status: number;
  creator: string;
  start_time: number;
  end_time: number;
  // for, against, abstain
  results: any;
  nft_votes: any;
  address_votes: any;
  address_vote_types: any;
}
