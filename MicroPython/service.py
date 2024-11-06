import struct

import bluetooth
import aioble
from aioble import Characteristic
import asyncio


def _encode_value(value):
    return struct.pack("<h", value)

class Service:

    def __init__(self,service,service_uuid,initial_state:int=0,initial_step:int=1,initial_cont:int=10):
        self.__state = initial_state
        self.__step = initial_step
        self.__count = initial_cont
        self.__run = 0
        self.__reset = 0
        self.__current_step = 0
        self.__service = service
        self.__ENV_SERVICE = service_uuid
        self.__ENV_CH_GET_STATE = bluetooth.UUID(service+0x0100+0x0001)
        self.__ENV_CH_GET_STEP = bluetooth.UUID(service+0x0100+0x0002)
        self.__ENV_CH_SET_STEP = bluetooth.UUID(service+0x0200+0x0002)
        self.__ENV_CH_GET_COUNT = bluetooth.UUID(service + 0x0100 + 0x0003)
        self.__ENV_CH_SET_COUNT = bluetooth.UUID(service + 0x0200 + 0x0003)
        self.__ENV_CH_GET_RUN = bluetooth.UUID(service + 0x0100 + 0x0004)
        self.__ENV_CH_SET_RUN = bluetooth.UUID(service + 0x0200 + 0x0004)
        self.__ENV_CH_SET_RESET = bluetooth.UUID(service + 0x0200 + 0x0005)

        self.__service = aioble.Service(self.__ENV_SERVICE)
        self.__ch_get_state = aioble.Characteristic(self.__service,self.__ENV_CH_GET_STATE, read=True, notify=True,initial=_encode_value(self.__state))
        self.__ch_get_step = aioble.Characteristic(self.__service,self.__ENV_CH_GET_STEP, read=True, notify=True,initial=_encode_value(self.__step))
        self.__ch_set_step = aioble.Characteristic(self.__service,self.__ENV_CH_SET_STEP, read=True,notify=True,write=True,capture=True,initial=_encode_value(self.__step))
        self.__ch_get_count = aioble.Characteristic(self.__service,self.__ENV_CH_GET_COUNT, read=True, notify=True,initial=_encode_value(self.__count))
        self.__ch_set_count = aioble.Characteristic(self.__service,self.__ENV_CH_SET_COUNT, read=True,notify=True,write=True,capture=True,initial=_encode_value(self.__count))
        self.__ch_get_run = aioble.Characteristic(self.__service, self.__ENV_CH_GET_RUN, read=True, notify=True,initial=_encode_value(self.__run))
        self.__ch_set_run = aioble.Characteristic(self.__service, self.__ENV_CH_SET_RUN, read=True, notify=True,write=True, capture=True, initial=_encode_value(self.__run))
        self.__ch_set_reset = aioble.Characteristic(self.__service, self.__ENV_CH_SET_RESET, read=True, notify=True,write=True, capture=True, initial=_encode_value(self.__reset))

        aioble.register_services(self.__service)

    async def __read_task(self,ch:Characteristic, on_change):
        while True:
            data = await ch.written()
            data = int.from_bytes(data[1], "big")
            on_change(self,data)
            await asyncio.sleep(1)

    async def __task(self):
        while True:
            if self.__run == 1:
                if self.__current_step<=self.__count:
                    self.__ch_get_count.write(_encode_value(self.__state),send_update=True)
                    print(self.__state,self.__step,self.__current_step,self.__count,self.__run)
                    self.__state += self.__step
                    self.__current_step += 1
                    if self.__current_step > self.__count:
                        self.__set_run(0)
                else:
                    self.__set_run(0)

    def __set_step(self,step):
        self.__step = step
        self.__ch_get_step.write(_encode_value(self.__step),send_update=True)

    def __set_count(self,count):
        self.__count = count
        self.__ch_get_count.write(_encode_value(self.__step),send_update=True)

    def __set_run(self,run):
        if self.__run == 0 and run == 0:
            return
        elif self.__run == 0 and run == 1:
            if self.__current_step > self.__count:
                self.__current_step = 0
            self.__run = run
            self.__ch_get_run.write(_encode_value(self.__run), send_update=True)
        elif self.__run == 1 and run == 0:
            self.__run = run
            self.__ch_get_run.write(_encode_value(self.__run), send_update=True)
        elif self.__run == 1 and run == 1:
            return

    def __set_reset(self,reset):
        if reset > self.__reset:
            self.__reset +=1
            self.__current_step = 0
    
    async def start(self):
        task_read_step = asyncio.create_task(self.__read_task(self.__ch_set_step,self.__set_step))
        task_read_count = asyncio.create_task(self.__read_task(self.__ch_set_count,self.__set_step))
        task_read_run = asyncio.create_task(self.__read_task(self.__ch_set_run,self.__set_run))
        task_read_reset = asyncio.create_task(self.__read_task(self.__ch_set_reset,self.__set_reset))
        task_service = asyncio.create_task(self.__task())
        await asyncio.gather(task_read_step,task_read_count,task_read_run,task_read_reset,task_service)






