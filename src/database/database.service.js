var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
export let DatabaseService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DatabaseService = _classThis = class {
        constructor(voicemailModel, callLogModel, configService) {
            this.voicemailModel = voicemailModel;
            this.callLogModel = callLogModel;
            this.configService = configService;
            this.supabase = createClient(this.configService.get('SUPABASE_URL'), this.configService.get('SUPABASE_API_KEY'), {
                auth: { persistSession: false }
            });
        }
        saveVoicemail(voicemailDetails) {
            return __awaiter(this, void 0, void 0, function* () {
                const voicemail = new this.voicemailModel(voicemailDetails);
                yield voicemail.save();
                yield this.supabase.from('voicemails').insert([voicemailDetails]);
                return voicemail;
            });
        }
        saveCallLog(payload) {
            return __awaiter(this, void 0, void 0, function* () {
                const filter = { CallSid: payload.CallSid };
                const voicemailAlreadyExists = yield this.callLogModel.findOne(filter);
                if (voicemailAlreadyExists) {
                    const updated = this.callLogModel.updateOne(filter, payload);
                }
                else {
                    const voicemail = new this.callLogModel(payload);
                    voicemail.save();
                }
                const recordAlreadyExists = yield this.supabase.from('calls')
                    .select()
                    .eq('CallSid', payload.CallSid)
                    .limit(1)
                    .single();
                if (recordAlreadyExists && recordAlreadyExists.data) {
                    this.supabase.from('calls').update(payload).eq('CallSid', payload.CallSid);
                }
                else {
                    this.supabase.from('calls').insert([payload]);
                }
                return true;
            });
        }
    };
    __setFunctionName(_classThis, "DatabaseService");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        DatabaseService = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DatabaseService = _classThis;
})();