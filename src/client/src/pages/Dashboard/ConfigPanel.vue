<template>
    <div class="q-pa-md row">
        <div class="q-gutter-y-md col-12">
            <q-card>
                <q-tabs
                    v-model="tab"
                    dense
                    class="bg-grey-3"
                    align="justify"
                    narrow-indicator
                >
                    <q-tab
                        name="devicePanel"
                        label="Manage Devices"
                    />
                    <q-tab
                        name="userPanel"
                        label="Manage Users"
												:disable="!isRightAuthentication(admin)"
                    />
                </q-tabs>

                <q-separator />

                <q-tab-panels
                    v-model="tab"
                    animated
                >
                    <q-tab-panel name="userPanel">
                        <div class="text-h6">User Management</div>
                        <user-panel></user-panel>
                    </q-tab-panel>

                    <q-tab-panel name="devicePanel">
                        <div class="text-h6">Device Management</div>
                        <device-panel></device-panel>
                    </q-tab-panel>

                </q-tab-panels>
            </q-card>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { actionIds } from '~/store/userdata/allIds'
import invokeApiLambda from '~/utils/server/invokeApiLambda'
import {
    GET_USER_LIST
} from '@shared/descriptions/endpoints/endpointIds'
import {
    pathOr
} from 'ramda'
import UserPanel from '~/components/ConfigPanel/UserPanel'
import DevicePanel from '~/components/ConfigPanel/DevicePanel'
import { admin } from '@root/src/shared/constants/authenticationTypes'

export default {
    name: 'ConfigPanel',
    components: {
        UserPanel, DevicePanel
    },
    data() {
        return {
						tab: 'devicePanel',
						admin
        }
    },
    computed: {
        ...mapGetters('userdata', [
            'username', 'error', 'isRightAuthentication'
				]),
    },
}

</script>

<style>
</style>
