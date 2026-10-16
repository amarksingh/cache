import Command from '@ostro/console/command';
/**
 * Class CacheTableCommand.
 */
class CacheTableCommand extends Command {

    $signature = 'cache:table';

    $description = 'Create a migration for the cache database table';

    /**
     * Create a new instance.
     * @param {*} $files
     */
    constructor($files: any) {
        super();
        this.$file = $files;
    }

    /**
     * handle method.
     * @async
     * @returns {any}
     */
    async handle() {
        let $fullPath = await this.createBaseMigration();

        await this.$file.put($fullPath, await this.$file.get(__dirname + '/stubs/cache.stub'));

        this.info('Migration created successfully!');

    }

    /**
     * createBaseMigration method.
     * @returns {any}
     */
    createBaseMigration() {
        let $name = 'create_cache_table';

        let $path = this.$app.databasePath('migrations');

        return this.$app['migration.creator'].create($name, $path);
    }
}

export default CacheTableCommand;