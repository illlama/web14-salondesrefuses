import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArtworkStatus } from 'src/artwork/artwork.status.enum';
import { ArtworkService } from 'src/artwork/service/artwork.service';
import AuctionService from 'src/auction/service/auction.service';

@Injectable()
export class CronTaskService {
    private readonly logger = new Logger(CronTaskService.name);
    private readonly modular = 1000 * 60 * 60 * 24;

    constructor(private readonly auctionService: AuctionService, private readonly artworkService: ArtworkService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async changeAuctionState() {
        this.logger.debug('Called when the every day 00:00');
        const auctions = await this.auctionService.getAuctions();

        const now = new Date().valueOf();
        const midNight = now - (now % this.modular);
        const artworkIds = auctions
            .filter(
                auction => auction.artwork.status === ArtworkStatus.InBid && midNight - auction.endAt.valueOf() <= 0,
            )
            .map(auction => auction.artwork.id);

        this.artworkService.bulkUpdateArtworkState(artworkIds);
    }
}
